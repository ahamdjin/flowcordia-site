const fs = require('node:fs');
const path = require('node:path');
const directory = process.argv[2];
if (!directory) throw new Error('Provide the QA artifact directory');
const inventory = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, 'app-doc-links.json'), 'utf8')
    .replace(/^\uFEFF/, '')
);
const template = fs.readFileSync(
  path.join(directory, 'qa-app-doc-links.template.js'),
  'utf8'
);
fs.writeFileSync(
  path.join(directory, 'qa-app-doc-links.js'),
  template.replace('__INVENTORY__', JSON.stringify(inventory))
);
