/* Build a self-contained preview of the pixel stories.

   It transpiles the real modules (lib/pixelStories.ts, lib/pixelTheme.ts and
   every story in lib/stories/), so the preview runs exactly the code the site
   runs, and draws each frame with the same cell drawing as
   components/PubCover.tsx (rounded cells, the unlit tint, the letterbox to the
   cover's aspect, light and dark cards).

     node docs/story-preview/build.mjs                  docs/story-preview/index.html, every story
     node docs/story-preview/build.mjs --story <id>     docs/story-preview/_work/<id>.html, that story only

   Open a page with ?sheet=<id> for a contact sheet of frames
   (docs/story-preview/sheet.py renders one to PNG). In --story mode the other
   story files are not loaded, so one story's half-finished edit never breaks
   another story's preview. Nothing here ships with the site. */

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const SITE = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..", "..");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");

const arg = process.argv.indexOf("--story");
const only = arg > 0 ? process.argv[arg + 1] : null;

function cjs(file) {
  return ts.transpileModule(read(file), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
}

const storyFiles = fs.readdirSync(path.join(SITE, "lib/stories"))
  .filter((f) => f.endsWith(".ts") && f !== "kit.ts")
  .map((f) => f.slice(0, -3))
  .filter((id) => !only || id === only);
if (only && storyFiles.length === 0) {
  console.error("no story file lib/stories/" + only + ".ts");
  process.exit(1);
}

const modules = { "lib/pixelTheme": cjs("lib/pixelTheme.ts"), "lib/pixelStories": cjs("lib/pixelStories.ts"), "lib/stories/kit": cjs("lib/stories/kit.ts") };
for (const id of storyFiles) modules["lib/stories/" + id] = cjs("lib/stories/" + id + ".ts");

const bundle =
  "const MODS = {\n" +
  Object.entries(modules).map(([k, code]) => JSON.stringify(k) + ": function (module, exports, require) {\n" + code + "\n}").join(",\n") +
  "\n};\n" +
  `const CACHE = {};
const REACT_STUB = { useEffect() {}, useState(v) { return [v, () => {}]; } };
function resolveSpec(base, spec) {
  if (spec === "react") return "react";
  const parts = base.split("/").slice(0, -1);
  for (const seg of spec.replace(/^@\\//, "").split("/")) {
    if (seg === ".") continue;
    if (seg === "..") parts.pop(); else parts.push(seg);
  }
  return (spec.startsWith("@/") ? spec.slice(2) : parts.join("/")).replace(/\\.tsx?$/, "");
}
function load(name) {
  if (name === "react") return REACT_STUB;
  if (!(name in MODS)) return { story: null };
  if (CACHE[name]) return CACHE[name].exports;
  const module = { exports: {} };
  CACHE[name] = module;
  MODS[name](module, module.exports, (spec) => load(resolveSpec(name, spec)));
  return module.exports;
}
const { STORIES, renderStory } = load("lib/pixelStories");
const { adaptPalette, CELL_TINTS } = load("lib/pixelTheme");
for (const k of Object.keys(STORIES)) if (!STORIES[k]) delete STORIES[k];`;

const manifest = JSON.parse(read("docs/story-preview/stories.json"));
for (const s of manifest) {
  const mime = { ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };
  s.coverData = s.cover && fs.existsSync(path.join(SITE, s.cover))
    ? "data:" + mime[path.extname(s.cover).toLowerCase()] + ";base64," + fs.readFileSync(path.join(SITE, s.cover)).toString("base64")
    : null;
}

const html = read("docs/story-preview/template.html")
  .replace("/*__ENGINE__*/", bundle)
  .replace("/*__MANIFEST__*/", "const MANIFEST = " + JSON.stringify(manifest) + ";");

const out = only ? path.join(SITE, "docs/story-preview/_work", only + ".html") : path.join(SITE, "docs/story-preview/index.html");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log("wrote " + path.relative(SITE, out) + " (" + Math.round(html.length / 1024) + " KB, " + storyFiles.length + " stories)");
