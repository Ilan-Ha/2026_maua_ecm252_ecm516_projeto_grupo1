import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const config = require('./api-shared-config.json');

export { config };
export default config;
