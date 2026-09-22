import * as path from 'path';
import * as fs from 'fs';

export type AppConfig = {
  url: string;
  ports: { back: Record<string, number> };
  paths: { events: { event: string; subscribe: string; unsubscribe: string } };
};

let cached: AppConfig | null = null;

export function getAppConfig(): AppConfig {
  if (cached) return cached;
  const configPath = path.resolve(__dirname, '../../../../../api-shared-config.json');
  cached = JSON.parse(fs.readFileSync(configPath, 'utf8')) as AppConfig;
  return cached;
}

export const SERVICE_NAME = 'event-bus';
export const PORT_KEY = 'eventBus';
