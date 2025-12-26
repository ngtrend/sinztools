/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = process.cwd();
const SITE_DIR = path.join(PROJECT_ROOT, "_site");
const SITEMAP_PATH = path.join(SITE_DIR, "sitemap.xml");
const TOOLS_JSON_PATH = path.join(PROJECT_ROOT, "src", "_data", "tools.json");

function fail(message) {
  console.error(`Sitemap validation failed: ${message}`);
  process.exitCode = 1;
}

function readRequiredFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing file: ${filePath}`);
    return null;
  }
  return fs.readFileSync(filePath, "utf8");
}

function extractLocs(xml) {
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const locs = [];
  for (const match of xml.matchAll(locRegex)) {
    locs.push(match[1].trim());
  }
  return locs;
}

function toOutputFilePath(url) {
  const pathname = url.pathname;

  if (pathname === "/") {
    return path.join(SITE_DIR, "index.html");
  }

  const relative = pathname.replace(/^\//, "");
  if (!relative) {
    return path.join(SITE_DIR, "index.html");
  }

  if (relative.endsWith("/")) {
    return path.join(SITE_DIR, relative, "index.html");
  }

  return path.join(SITE_DIR, relative);
}

function readToolsSlugs() {
  const raw = readRequiredFile(TOOLS_JSON_PATH);
  if (!raw) return [];

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    fail(`tools.json is not valid JSON: ${err.message}`);
    return [];
  }

  const slugs = [];
  const categories = data?.categories || {};
  for (const category of Object.values(categories)) {
    for (const tool of category.tools || []) {
      if (tool?.slug) slugs.push(tool.slug);
    }
  }
  return slugs;
}

function main() {
  const xml = readRequiredFile(SITEMAP_PATH);
  if (!xml) return;

  if (!xml.includes("<urlset") || !xml.includes("</urlset>")) {
    fail("sitemap.xml does not look like a valid <urlset> sitemap");
    return;
  }

  const locs = extractLocs(xml);
  if (locs.length === 0) {
    fail("No <loc> entries found in sitemap.xml");
    return;
  }

  const unique = new Set(locs);
  if (unique.size !== locs.length) {
    fail("Duplicate <loc> entries found");
  }

  const expectedStaticPaths = [
    "/",
    "/tools/",
    "/about/",
    "/contact/",
    "/privacy-policy/",
    "/terms/",
  ];

  const expectedStaticUrls = new Set(
    expectedStaticPaths.map((p) => `https://www.sinztools.app${p}`)
  );

  for (const staticUrl of expectedStaticUrls) {
    if (!unique.has(staticUrl)) {
      fail(`Missing expected static URL in sitemap: ${staticUrl}`);
    }
  }

  const toolSlugs = readToolsSlugs();
  for (const slug of toolSlugs) {
    const toolUrl = `https://www.sinztools.app/tools/${slug}/`;
    if (!unique.has(toolUrl)) {
      fail(`Missing tool URL from tools.json in sitemap: ${toolUrl}`);
    }
  }

  for (const loc of locs) {
    let url;
    try {
      url = new URL(loc);
    } catch {
      fail(`Invalid URL in <loc>: ${loc}`);
      continue;
    }

    if (url.protocol !== "https:") {
      fail(`Non-https URL in <loc>: ${loc}`);
    }

    if (url.hostname !== "www.sinztools.app") {
      fail(`Unexpected host in <loc> (expected www.sinztools.app): ${loc}`);
    }

    if (url.search || url.hash) {
      fail(`URL in <loc> should not contain query/hash: ${loc}`);
    }

    const outPath = toOutputFilePath(url);
    if (!fs.existsSync(outPath)) {
      fail(`Sitemap URL does not map to an output file: ${loc} -> ${outPath}`);
    }
  }

  if (process.exitCode === 1) {
    return;
  }

  console.log(`Sitemap OK: ${locs.length} URLs validated.`);
}

main();
