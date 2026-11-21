import fs from "node:fs";
import path from "node:path";

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|mjs|md|css)$/.test(name)) out.push(p);
  }
  return out;
}

const files = walk(".");
const urls = new Set();
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/https:\/\/images\.unsplash\.com[^"'\\\s)]+/g)) {
    urls.add(match[0]);
  }
}

const bad = [];
for (const url of urls) {
  const res = await fetch(url, { method: "HEAD", redirect: "follow" });
  if (!res.ok) bad.push({ status: res.status, url });
}

console.log(JSON.stringify({ checked: urls.size, badCount: bad.length, bad }, null, 2));
