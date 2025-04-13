const semver = require('semver');
const { engines } = require('../package.json');
const version = engines.node;

if (!semver.satisfies(process.version, version)) {
  console.error(`\x1b[31mGerekli Node.js sürümü ${version} iken, siz ${process.version} kullanıyorsunuz.\x1b[0m`);
  console.error(`\x1b[32mLütfen Node.js'i güncelleyin veya nvm kullanıyorsanız "nvm use" komutunu çalıştırın.\x1b[0m`);
  process.exit(1);
}

console.log(`\x1b[32mNode.js sürümü kontrol edildi: ${process.version} ✓\x1b[0m`); 