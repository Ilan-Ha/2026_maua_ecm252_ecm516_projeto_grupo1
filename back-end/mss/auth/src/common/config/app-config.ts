import { config, type AppConfig } from '@allforone/contracts';

export type { AppConfig };

export function getAppConfig(): AppConfig {
  return config;
}

export const SERVICE_NAME = 'auth';
export const MONGO_DB_NAME = 'autentification';
export const PORT_KEY = 'auth';
