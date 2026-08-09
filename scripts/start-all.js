const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

if (!fs.existsSync(path.join(root, '.env'))) {
  console.error("Erro: crie o arquivo .env na raiz com MONGO_URI=...");
  process.exit(1);
}

const backMssDir = path.join(root, 'back-end', 'mss');
if (!fs.existsSync(path.join(backMssDir, '.env'))) {
  fs.copyFileSync(path.join(root, '.env'), path.join(backMssDir, '.env'));
  console.log("Copiado .env -> back-end/mss/.env");
}

const frontDir = fs.existsSync(path.join(root, 'front-end', 'project'))
  ? path.join(root, 'front-end', 'project')
  : path.join(root, 'FRONT-END', 'project');

const services = [
  { name: 'event', path: path.join(root, 'back-end', 'infra', 'event-bus'), color: 'blue' },
  { name: 'request', path: path.join(root, 'back-end', 'infra', 'request-bus'), color: 'green' },
  { name: 'auth', path: path.join(root, 'back-end', 'mss', 'Identity', 'auth'), color: 'magenta' },
  { name: 'user', path: path.join(root, 'back-end', 'mss', 'Identity', 'user'), color: 'yellow' },
  { name: 'catalog', path: path.join(root, 'back-end', 'mss', 'Catalog', 'catalog'), color: 'cyan' },
  { name: 'review', path: path.join(root, 'back-end', 'mss', 'Engagment', 'review'), color: 'white' },
  { name: 'history', path: path.join(root, 'back-end', 'mss', 'Engagment', 'history'), color: 'red' },
  { name: 'gateway', path: path.join(root, 'back-end', 'infra', 'gateway'), color: 'brightBlue' },
  { name: 'front', path: frontDir, color: 'brightGreen', cmd: 'run dev' }
];

const names = services.map(s => s.name).join(',');
const colors = services.map(s => s.color).join(',');

console.log("\nSubindo MSS + front-end...");
console.log("  Back-end (gateway): http://localhost:10000");
console.log("  Front-end:          http://localhost:5173\n");

const commands = services.map(s => `\"npm --prefix \"\"${s.path}\"\" ${s.cmd || 'start'}\"`);

const args = [
  'concurrently',
  '-k',
  '-n', names,
  '-c', colors,
  ...commands
];

const child = spawn('npx', args, { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code));
