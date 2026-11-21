import fs from "node:fs";

const text = fs.readFileSync("lib/mock-data.ts", "utf8");
const urls = [
  ...new Set(
    [...text.matchAll(/https:\/\/images\.unsplash\.com[^"'\\\s]+/g)].map(
      (m) => m[0],
    ),
  ),
];

const bad = [];
for (const url of urls) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (!res.ok) bad.push({ url, status: res.status });
  } catch (error) {
    bad.push({ url, status: "ERR", error: String(error) });
  }
}

console.log(JSON.stringify({ total: urls.length, badCount: bad.length, bad }, null, 2));
