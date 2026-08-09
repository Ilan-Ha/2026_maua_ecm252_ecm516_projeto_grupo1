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
  path.join(root, 'back-end', 'mss', 'Identity', 'auth'),
  path.join(root, 'back-end', 'mss', 'Identity', 'user'),
  path.join(root, 'back-end', 'mss', 'Catalog', 'catalog'),
  path.join(root, 'back-end', 'mss', 'Engagment', 'review'),
  path.join(root, 'back-end', 'mss', 'Engagment', 'history'),
  fs.existsSync(path.join(root, 'front-end', 'project')) 
    ? path.join(root, 'front-end', 'project')
    : path.join(root, 'FRONT-END', 'project')
];

for (const dir of directories) {
  if (fs.existsSync(path.join(dir, 'package.json'))) {
    run('npm install', dir);
  }
}
