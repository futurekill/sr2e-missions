// Generate placeholder Scenes for the Missions module. Each act of the two
// adventures (Malpractice, Under the Influence) gets a labeled placeholder
// battlemap (assets/scenes/*.png) — swap the image for a final map later; the
// Scene keeps its grid/size. Re-run to regenerate. (Adapted from the Double
// Exposure module's gen-scenes.mjs.)
import { writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const idFor = (s) => createHash("sha1").update("mi-scene:" + s).digest("hex").slice(0, 16);
const W = 1600, H = 1200, GRID = 100;
mkdirSync("assets/scenes", { recursive: true });
mkdirSync("packs-src/mi-scenes", { recursive: true });

// One placeholder battlemap per adventure act. Prune the social-only acts in
// Foundry if you don't need a map for them.
const SCENES = [
  "Malpractice 1 — Never Deal With the Wagon",
  "Malpractice 2 — Train In Vain",
  "Malpractice 3 — Spies Like Us",
  "Malpractice 4 — Crash Course",
  "Malpractice 5 — Chicken Soup",
  "Malpractice 6 — Sleepless in Seattle",
  "Malpractice 7 — Déjà Vu",
  "Malpractice 8 — Picking Up the Pieces",
  "Under the Influence 1 — Vanishing Act",
  "Under the Influence 2 — Leopard's Den",
  "Under the Influence 3 — Chez Cuca",
  "Under the Influence 4 — Decking the Doctor",
  "Under the Influence 5 — Whose Side Are You On?",
  "Under the Influence 6 — This May Sting a Little",
  "Under the Influence 7 — Picking Up the Pieces"
];

function placeholderPng(name, file) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let lines = "";
  for (let x = 0; x <= W; x += GRID) lines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#2a2a3a" stroke-width="1"/>`;
  for (let y = 0; y <= H; y += GRID) lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#2a2a3a" stroke-width="1"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#15151f"/>${lines}
    <text x="${W/2}" y="${H/2 - 20}" fill="#e0d4f0" font-family="sans-serif" font-size="48" font-weight="bold" text-anchor="middle">${esc(name)}</text>
    <text x="${W/2}" y="${H/2 + 40}" fill="#8a7fb0" font-family="sans-serif" font-size="26" text-anchor="middle">placeholder map — replace with final art</text>
  </svg>`;
  writeFileSync("/tmp/mi-scene.svg", svg);
  execFileSync("rsvg-convert", ["-o", file, "/tmp/mi-scene.svg"]);
}

let n = 0;
for (const name of SCENES) {
  const _id = idFor(name);
  const safe = name.replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const img = `modules/sr2e-missions/assets/scenes/${safe}.png`;
  placeholderPng(name, `assets/scenes/${safe}.png`);
  const doc = {
    _id, name, navigation: true, navName: "", active: false,
    width: W, height: H, padding: 0.25, backgroundColor: "#15151f",
    background: { src: img, anchorX: 0.5, anchorY: 0.5, offsetX: 0, offsetY: 0, fit: "fill", scaleX: 1, scaleY: 1, rotation: 0, tint: "#ffffff", alphaThreshold: 0 },
    foreground: null, foregroundElevation: null, thumb: null,
    grid: { type: 1, size: GRID, style: "solidLines", thickness: 1, color: "#000000", alpha: 0.2, distance: 1, units: "m" },
    initial: null, tokenVision: false, fog: { exploration: false, reset: 0, overlay: null },
    globalLight: { enabled: true }, darkness: 0, environment: {},
    drawings: [], tokens: [], lights: [], notes: [], sounds: [], regions: [], templates: [], tiles: [], walls: [],
    folder: null, sort: n * 100, flags: {},
    _stats: { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.1.0", createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null, compendiumSource: null, duplicateSource: null, exportSource: null },
    ownership: { default: 0 }, _key: `!scenes!${_id}`
  };
  writeFileSync(`packs-src/mi-scenes/${safe}_${_id}.json`, JSON.stringify(doc, null, 2) + "\n");
  n++;
}
console.log(`wrote ${n} placeholder scenes`);
