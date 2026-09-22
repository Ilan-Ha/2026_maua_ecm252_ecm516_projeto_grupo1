import config from "../../../back-end/api-shared-config.json" with { type: "json" };

/** URL base para o front (sempre via API Gateway MSS) */
export const apiBase = config.gateway.baseUrl;

export default config;
