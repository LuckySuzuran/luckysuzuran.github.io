// Rebuild the original, small GIF without any third-party packages.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const width = 240, height = 135;
const palette = [
  [232, 238, 227], [246, 232, 206], [235, 199, 140], [181, 197, 181],
  [124, 157, 136], [149, 187, 172], [66, 109, 89], [41, 76, 62]
];
const bytes = [...Buffer.from('GIF89a')];
const word = n => bytes.push(n & 255, (n >> 8) & 255);
word(width); word(height);
bytes.push(0xf2, 0, 0, ...palette.flat());
// Loop forever using the standard Netscape application extension.
bytes.push(0x21, 0xff, 11, ...Buffer.from('NETSCAPE2.0'), 3, 1, 0, 0, 0);

for (let frame = 0; frame < 12; frame++) {
  const pixels = [];
  const sunY = 33 + Math.sin(frame * Math.PI / 6) * 4;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let c = y < 54 ? 0 : 1;
      if ((x - 174) ** 2 + (y - sunY) ** 2 < 12 ** 2) c = 2;
      const mountain = 65 - 43 * Math.max(0, 1 - Math.abs(x - 100) / 58);
      if (y > mountain && y < 93) c = 3;
      if (y > 77 - 17 * Math.sin(x / 37) && y < 94) c = 4;
      if (y >= 89) c = 5;
      if (y > 94 && y < 125 && (y + frame) % 13 === 0 && (x + frame * 3) % 81 < 31) c = 0;
      if (x < 75 && y > 101 + Math.sin(x / 18) * 8) c = 6;
      if (x > 194 && y > 112 - (x - 194) / 3) c = 6;
      for (const [tx, ty, size] of [[23, 58, 27], [44, 77, 18], [216, 70, 23]]) {
        if (y >= ty && y <= ty + size && Math.abs(x - tx) < (y - ty) * .45) c = 7;
        if (y > ty + size && y < ty + size + 13 && Math.abs(x - tx) < 2) c = 7;
      }
      pixels.push(c);
    }
  }
  bytes.push(0x21, 0xf9, 4, 0x04); word(10); bytes.push(0, 0);
  bytes.push(0x2c); word(0); word(0); word(width); word(height); bytes.push(0);
  // Simple fixed-width LZW: reset before the 4-bit code table grows.
  // Four palette indices per clear code keeps the encoder deliberately tiny.
  const codes = [];
  for (let i = 0; i < pixels.length; i += 4) codes.push(8, ...pixels.slice(i, i + 4));
  codes.push(9);
  const packed = [];
  let accumulator = 0, bits = 0;
  for (const code of codes) {
    accumulator |= code << bits;
    bits += 4;
    while (bits >= 8) { packed.push(accumulator & 255); accumulator >>= 8; bits -= 8; }
  }
  if (bits) packed.push(accumulator & 255);
  bytes.push(3);
  for (let i = 0; i < packed.length; i += 255) {
    const block = packed.slice(i, i + 255);
    bytes.push(block.length, ...block);
  }
  bytes.push(0);
}
bytes.push(0x3b);
const destination = fileURLToPath(new URL('../assets/images/demo.gif', import.meta.url));
writeFileSync(destination, Buffer.from(bytes));
console.log(`Wrote ${destination} (${bytes.length.toLocaleString()} bytes, 12 frames).`);
