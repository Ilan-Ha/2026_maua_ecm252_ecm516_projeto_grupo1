import { config, type AppConfig } from '@allforone/contracts';

export type { AppConfig };

export function getAppConfig(): AppConfig {
  return config;
}

export const SERVICE_NAME = 'catalog';
export const MONGO_DB_NAME = 'test';
export const PORT_KEY = 'catalog';
