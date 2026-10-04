const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.join(__dirname, '..');
const inventory = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, 'app-doc-links.json'), 'utf8')
    .replace(/^\uFEFF/, '')
);
const source = fs.readFileSync(
  path.join(root, 'lib/app-doc-guides.ts'),
  'utf8'
);
const exportsObject = {};
vm.runInNewContext(
  ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  { exports: exportsObject }
);
const failures = [];
for (const record of inventory.records) {
  const slug =
    record.path === 'v3/troubleshooting' ? 'troubleshooting' : record.path;
  const guide = exportsObject.findAppDocGuide(slug);
  if (guide) {
    if (
      record.anchor &&
      !guide.sections.some((section) => section.id === record.anchor)
    )
      failures.push(slug + '#' + record.anchor);
    continue;
  }
  const file = path.join(root, 'app/docs', slug, 'page.mdx');
  if (!fs.existsSync(file)) {
    failures.push(slug || '/docs');
    continue;
  }
  if (record.anchor) {
    const headings = [
      ...fs.readFileSync(file, 'utf8').matchAll(/^#+ (.+)$/gm),
    ].map((match) =>
      match[1]
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
    );
    if (!headings.includes(record.anchor))
      failures.push(slug + '#' + record.anchor);
  }
}
if (inventory.dynamic.length)
  failures.push('Unresolved dynamic documentation links');
if (failures.length)
  throw new Error(
    'Missing documentation: ' + [...new Set(failures)].join(', ')
  );
console.log(
  inventory.paths.length +
    ' app documentation destinations and all recorded anchors are covered.'
);
