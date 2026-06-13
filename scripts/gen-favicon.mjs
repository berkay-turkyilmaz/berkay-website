import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgPath = join(root, "public/icon.svg");
const pngPath = join(root, "public/favicon-32.png");
const icoPath = join(root, "public/favicon.ico");

execFileSync(
  "npx",
  ["--yes", "@resvg/resvg-js-cli", svgPath, pngPath, "--fit-width", "32", "--fit-height", "32"],
  { stdio: "inherit", shell: true }
);

const png = readFileSync(pngPath);
const offset = 6 + 16;
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

const entry = Buffer.alloc(16);
entry[0] = 32;
entry[1] = 32;
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(offset, 12);

writeFileSync(icoPath, Buffer.concat([header, entry, png]));
console.log(`favicon.ico written (${header.length + entry.length + png.length} bytes)`);
