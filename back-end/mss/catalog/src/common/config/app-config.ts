import * as path from 'path';
import * as fs from 'fs';

export type AppConfig = {
  url: string;
  ports: { back: Record<string, number> };
  paths: any;
  requests: any;
  events: any;
};

let cached: AppConfig | null = null;

export function getAppConfig(): AppConfig {
  if (cached) return cached;
  const configPath = path.resolve(__dirname, '../../../../../api-shared-config.json');
  cached = JSON.parse(fs.readFileSync(configPath, 'utf8')) as AppConfig;
  return cached;
}

export const SERVICE_NAME = 'catalog';
export const MONGO_DB_NAME = 'test';
export const PORT_KEY = 'catalog';
