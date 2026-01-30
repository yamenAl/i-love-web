/**
 * Makes black (and near-black) pixels transparent in a PNG.
 * Usage: node scripts/make-black-transparent.js <input> [output]
 * If output omitted, overwrites input.
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const input = process.argv[2] || join(__dirname, '../src/lib/assets/images/light-background/cloud.png');
const output = process.argv[3] || input;

const BLACK_THRESHOLD = 30; // pixels with r,g,b all <= this become transparent

async function main() {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(output);

  console.log('Done:', output);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
