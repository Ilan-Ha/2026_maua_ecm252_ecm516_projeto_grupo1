import mongoose from 'mongoose';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

export const correlationStore = new AsyncLocalStorage();

function enabled() {
  const raw = process.env.LOG_ENABLED;
  if (raw === undefined || raw === '') return true;
  return raw !== '0' && String(raw).toLowerCase() !== 'false';
}

function ttlSeconds() {
  const days = Number(process.env.LOG_TTL_DAYS || 7);
  return Math.max(1, days) * 24 * 60 * 60;
}

function dbName() {
  return process.env.LOG_MONGO_DB || 'allforone_logs';
}

let connectionPromise = null;
let LogModel = null;

const logSchema = new mongoose.Schema(
  {
    service: { type: String, required: true, index: true },
    level: { type: String, enum: ['debug', 'info', 'warn', 'error'], default: 'info', index: true },
    kind: {
      type: String,
      enum: ['http', 'event', 'request', 'manual', 'exception'],
      default: 'manual',
      index: true,
    },
    message: { type: String, required: true },
    correlationId: { type: String, index: true },
    method: String,
    path: String,
    statusCode: Number,
    durationMs: Number,
    error: { name: String, message: String, stack: String },
    meta: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'app_logs', versionKey: false },
);

logSchema.index({ service: 1, createdAt: -1 });
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: ttlSeconds() });

async function getModel() {
  if (!enabled()) return null;
  const uri = process.env.MONGO_URI;
  if (!uri) return null;
  if (!connectionPromise) {
    connectionPromise = mongoose
      .createConnection(uri, { dbName: dbName() })
      .asPromise()
      .catch((err) => {
        connectionPromise = null;
        console.error('[logging] falha ao conectar Mongo de logs:', err?.message || err);
        throw err;
      });
  }
  try {
    const conn = await connectionPromise;
    if (!LogModel) {
      LogModel = conn.models.AppLog || conn.model('AppLog', logSchema);
    }
    return LogModel;
  } catch {
    return null;
  }
}

export async function writeLog(input) {
  try {
    const model = await getModel();
    if (!model) return;
    await model.create({
      ...input,
      level: input.level || 'info',
      kind: input.kind || 'manual',
      createdAt: new Date(),
    });
  } catch (err) {
    console.error('[logging] write failed:', err?.message || err);
  }
}

export function serializeError(err) {
  if (!err) return {};
  if (err instanceof Error) return { name: err.name, message: err.message, stack: err.stack };
  return { message: String(err) };
}

export const CORRELATION_HEADER = 'x-correlation-id';

export function correlationMiddleware(req, res, next) {
  const incoming = req.header(CORRELATION_HEADER);
  const correlationId = incoming && incoming.trim() ? incoming.trim() : randomUUID();
  req.correlationId = correlationId;
  res.setHeader(CORRELATION_HEADER, correlationId);
  correlationStore.run(correlationId, () => next());
}

export function httpLoggingMiddleware(service) {
  return (req, res, next) => {
    const started = Date.now();
    const correlationId = req.correlationId || req.header(CORRELATION_HEADER);
    const kind =
      service === 'event-bus' ? 'event' : service === 'request-bus' ? 'request' : 'http';
    res.on('finish', () => {
      const statusCode = res.statusCode;
      const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
      void writeLog({
        service,
        level,
        kind,
        message: `${req.method} ${req.originalUrl || req.url} → ${statusCode}`,
        correlationId,
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode,
        durationMs: Date.now() - started,
      });
    });
    next();
  };
}
