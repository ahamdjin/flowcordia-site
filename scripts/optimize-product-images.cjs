const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const input = process.argv[2];
  if (!input)
    throw new Error(
      'Provide the directory containing the source illustration PNGs'
    );
  for (const name of ['policy-illustration', 'workflow-views-illustration']) {
    const root = path.join(__dirname, '../public/images/product');
    await sharp(path.join(input, name + '.png'))
      .webp({ quality: 88 })
      .toFile(path.join(root, name + '.webp'));
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
