import * as path from 'path';
import * as dotenv from 'dotenv';

export function loadEnv(fromDir: string): void {
  const candidatePaths = [
    path.join(fromDir, '../../../../.env'),
    path.join(fromDir, '../../../.env'),
    path.join(fromDir, '../../.env'),
    path.join(fromDir, '../.env'),
    path.join(fromDir, '.env'),
  ];
  for (const envPath of candidatePaths) {
    dotenv.config({ path: envPath, override: true, quiet: true });
  }
}
