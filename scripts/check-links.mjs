// Checks that every link and picture inside the built site (dist/) points to a file that exists.
import fs from 'node:fs';
import path from 'node:path';
import { BASE } from '../site.config.mjs';

const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../dist');
const pages = [];
const walk = d => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p); } };
walk(DIST);
let bad = 0;
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)) {
    let target;
    if (url.startsWith('.')) target = path.join(path.dirname(file), decodeURI(url));
    else if (url.startsWith('//') || (!url.startsWith(BASE + '/') && url !== BASE)) continue;
    else target = path.join(DIST, decodeURI(url.slice(BASE.length)));
    if (url.endsWith('/')) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) { bad++; console.log(`${path.relative(DIST, file)} -> ${url}`); }
  }
}
console.log(`${pages.length} pages checked, ${bad} broken link(s)`);
process.exit(bad ? 1 : 0);
