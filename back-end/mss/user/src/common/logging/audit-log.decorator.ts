import { SetMetadata } from '@nestjs/common';
import type { LogLevel } from './writer';

export const AUDIT_LOG_KEY = 'allforone:audit_log';

export type AuditLogOptions = {
  message?: string;
  level?: LogLevel;
  kind?: 'manual' | 'event' | 'request';
};

export const AuditLog = (options: AuditLogOptions = {}) =>
  SetMetadata(AUDIT_LOG_KEY, options);
