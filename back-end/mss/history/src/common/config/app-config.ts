import { config, type AppConfig } from '@allforone/contracts';

export type { AppConfig };

export function getAppConfig(): AppConfig {
  return config;
}

/** Nome usado na inscrição do Event Bus (compatibilidade com o Express antigo) */
export const SERVICE_NAME = 'product user search history';
export const MONGO_DB_NAME = 'userProductHistory';
export const PORT_KEY = 'history';
