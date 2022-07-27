const { writeFileSync } = require('fs');
const packages = require('../package.json');
const manifest = require('../public/manifest.json');

const version = packages.version;
manifest.version = version;
try {
  writeFileSync('./public/manifest.json', JSON.stringify(manifest, null, 2));
  console.log('manifest版本升级成功:' + version);
} catch (error) {
  console.log('manifest版本升级失败');
}
