const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function run(cmd, dir) {
  console.log(`\n==> Instalando em: ${dir}`);
  try {
    execSync(cmd, { cwd: dir, stdio: 'inherit' });
  } catch (e) {
    console.error(`Erro ao instalar em ${dir}`);
  }
}

const directories = [
  root,
  path.join(root, 'back-end', 'mss'),
  path.join(root, 'back-end', 'infra', 'event-bus'),
  path.join(root, 'back-end', 'infra', 'request-bus'),
  path.join(root, 'back-end', 'infra', 'gateway'),
  path.join(root, 'back-end', 'mss', 'auth'),
  path.join(root, 'back-end', 'mss', 'user'),
  path.join(root, 'back-end', 'mss', 'catalog'),
  path.join(root, 'back-end', 'mss', 'review'),
  path.join(root, 'back-end', 'mss', 'history'),
  path.join(root, 'back-end', 'mss', 'logs'),
  path.join(root, 'back-end', 'shared', 'logging'),
  fs.existsSync(path.join(root, 'front-end', 'project')) 
    ? path.join(root, 'front-end', 'project')
    : path.join(root, 'FRONT-END', 'project'),
  path.join(root, 'front-end', 'logs'),
];

for (const dir of directories) {
  if (fs.existsSync(path.join(dir, 'package.json'))) {
    run('npm install', dir);
  }
}
