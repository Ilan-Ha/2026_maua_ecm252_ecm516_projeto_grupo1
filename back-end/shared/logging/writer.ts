import mongoose from 'mongoose';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogKind = 'http' | 'event' | 'request' | 'manual' | 'exception';

export type AppLogError = {
  name?: string;
  message?: string;
  stack?: string;
};

export type AppLogInput = {
  service: string;
  level?: LogLevel;
  kind?: LogKind;
  message: string;
  correlationId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  durationMs?: number;
  error?: AppLogError;
  meta?: Record<string, unknown>;
};

export type AppLogRecord = AppLogInput & {
  _id?: string;
  level: LogLevel;
  kind: LogKind;
  createdAt: Date;
};

let connectionPromise: Promise<mongoose.Connection> | null = null;
let LogModel: mongoose.Model<AppLogRecord> | null = null;

function enabled(): boolean {
  const raw = process.env.LOG_ENABLED;
  if (raw === undefined || raw === '') return true;
  return raw !== '0' && raw.toLowerCase() !== 'false';
}

function ttlSeconds(): number {
  const days = Number(process.env.LOG_TTL_DAYS || 7);
  return Math.max(1, days) * 24 * 60 * 60;
}

function dbName(): string {
  return process.env.LOG_MONGO_DB || 'allforone_logs';
}

const logSchema = new mongoose.Schema(
  {
    service: { type: String, required: true, index: true },
    level: {
      type: String,
      enum: ['debug', 'info', 'warn', 'error'],
      default: 'info',
      index: true,
    },
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
    error: {
      name: String,
      message: String,
      stack: String,
    },
    meta: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'app_logs', versionKey: false },
);

logSchema.index({ service: 1, createdAt: -1 });
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: ttlSeconds() });

async function getModel(): Promise<mongoose.Model<AppLogRecord> | null> {
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
      LogModel =
        (conn.models.AppLog as mongoose.Model<AppLogRecord>) ||
        conn.model<AppLogRecord>('AppLog', logSchema);
    }
    return LogModel;
  } catch {
    return null;
  }
}

export async function writeLog(input: AppLogInput): Promise<void> {
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
    console.error('[logging] write failed:', (err as Error)?.message || err);
  }
}

export function serializeError(err: unknown): AppLogError {
  if (!err) return {};
  if (err instanceof Error) {
    return { name: err.name, message: err.message, stack: err.stack };
  }
  return { message: String(err) };
}

export async function queryLogs(filter: {
  service?: string;
  level?: string;
  q?: string;
  from?: Date;
  to?: Date;
  limit?: number;
  before?: Date;
}): Promise<AppLogRecord[]> {
  const model = await getModel();
  if (!model) return [];

  const query: Record<string, unknown> = {};
  if (filter.service) query.service = filter.service;
  if (filter.level) query.level = filter.level;
  if (filter.q) query.message = { $regex: filter.q, $options: 'i' };
  if (filter.from || filter.to || filter.before) {
    const createdAt: Record<string, Date> = {};
    if (filter.from) createdAt.$gte = filter.from;
    if (filter.to) createdAt.$lte = filter.to;
    if (filter.before) createdAt.$lt = filter.before;
    query.createdAt = createdAt;
  }

  const limit = Math.min(Math.max(filter.limit || 100, 1), 500);
  return model.find(query).sort({ createdAt: -1 }).limit(limit).lean().exec() as Promise<
    AppLogRecord[]
  >;
}

export async function findLogById(id: string): Promise<AppLogRecord | null> {
  const model = await getModel();
  if (!model || !mongoose.isValidObjectId(id)) return null;
  return model.findById(id).lean().exec() as Promise<AppLogRecord | null>;
}
