import config from '../../../api-shared-config.json' with { type: 'json' }

export const apiBase = config.gateway.baseUrl

export function serviceBase(serviceName) {
  return config.services[serviceName].baseUrl
}

export default config
