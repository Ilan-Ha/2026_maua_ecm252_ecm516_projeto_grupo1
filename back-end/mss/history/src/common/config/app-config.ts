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

/** Nome usado na inscrição do Event Bus (compatibilidade com o Express antigo) */
export const SERVICE_NAME = 'product user search history';
export const MONGO_DB_NAME = 'userProductHistory';
export const PORT_KEY = 'history';
