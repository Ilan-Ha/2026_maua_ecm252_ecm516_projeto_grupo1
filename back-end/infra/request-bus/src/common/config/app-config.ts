import * as path from 'path';
import * as fs from 'fs';

export type AppConfig = {
  url: string;
  ports: { back: Record<string, number> };
  paths: { requests: { request: string } };
  requests: {
    user: {
      exist: string;
      byEmail?: string;
      byAuthId: string;
      name: { exits: string; valdate: string; tell: string };
    };
    catalog: { product: { exist: string } };
  };
};

let cached: AppConfig | null = null;

export function getAppConfig(): AppConfig {
  if (cached) return cached;
  const configPath = path.resolve(__dirname, '../../../../../api-shared-config.json');
  cached = JSON.parse(fs.readFileSync(configPath, 'utf8')) as AppConfig;
  return cached;
}

export const SERVICE_NAME = 'request-bus';
export const PORT_KEY = 'requestBus';
