const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = process.argv[2];
if (!root) throw new Error('Provide the current Flowcordia app checkout');
const records = [];
const dynamic = [];
function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (
      ['node_modules', 'dist', 'build', '.git', 'public'].includes(entry.name)
    )
      continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(file);
      continue;
    }
    if (!/\.[cm]?[jt]sx?$/.test(file) || /\.(test|spec)\./.test(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    function add(url) {
      const full = url.startsWith('https:')
        ? url
        : 'https://flowcordia.com/docs/' + url.replace(/^\/+/, '');
      const parsed = new URL(full);
      records.push({
        path: parsed.pathname.replace(/^\/docs\/?/, ''),
        anchor: parsed.hash.slice(1),
        file: path.relative(root, file).replaceAll('\\', '/'),
      });
    }
    function visit(node) {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === 'docsPath'
      ) {
        const arg = node.arguments[0];
        if (
          arg &&
          (ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg))
        )
          add(arg.text);
        else
          dynamic.push({
            file: path.relative(root, file),
            expression: node.getText(ast),
          });
      }
      if (
        ts.isStringLiteral(node) ||
        ts.isNoSubstitutionTemplateLiteral(node)
      ) {
        for (const match of node.text.matchAll(
          /https:\/\/flowcordia\.com\/docs(?:\/[^\s"'<>]*)?/g
        ))
          add(match[0].replace(/[.,;)]+$/, ''));
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
}
for (const dir of [
  'apps/webapp/app',
  'apps/flowcordia-studio-activepieces/src',
])
  walk(path.join(root, dir));
records.push({
  path: 'v3/troubleshooting',
  anchor: '',
  file: 'apps/webapp/app/utils/pathBuilder.ts:docsTroubleshootingPath',
});
const unique = [...new Set(records.map((record) => record.path))].sort();
process.stdout.write(
  JSON.stringify(
    { source: 'Flowcordia dashboard source', paths: unique, records, dynamic },
    null,
    2
  )
);
