/** Contrato compartilhado AllForOne (portas, paths, events, requests, services). */
export type AppConfig = {
  url: string;
  start: string;
  gateway: {
    port: number;
    baseUrl: string;
  };
  requests: Record<string, any>;
  events: Record<string, any>;
  ports: {
    back: Record<string, number>;
    front: Record<string, number>;
  };
  paths: Record<string, any>;
  services: Record<
    string,
    {
      port: number;
      endpoints: Record<string, string>;
    }
  >;
  ownership: Record<string, string>;
};

export declare const config: AppConfig;
declare const _default: AppConfig;
export default _default;
