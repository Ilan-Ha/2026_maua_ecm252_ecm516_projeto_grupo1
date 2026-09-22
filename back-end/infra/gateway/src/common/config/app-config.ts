import { config, type AppConfig } from '@allforone/contracts';

export type { AppConfig };

export function getAppConfig(): AppConfig {
  return config;
}

export const SERVICE_NAME = 'gateway';
export const PORT_KEY = 'gateway';
