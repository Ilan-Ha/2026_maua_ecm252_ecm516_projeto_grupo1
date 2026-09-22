import { config, type AppConfig } from '@allforone/contracts';

export type { AppConfig };

export function getAppConfig(): AppConfig {
  return config;
}

export const SERVICE_NAME = 'user';
export const MONGO_DB_NAME = 'userProfile';
export const PORT_KEY = 'user';
