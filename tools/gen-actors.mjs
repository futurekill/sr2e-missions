// Generate Missions cast NPCs (type "npc") into packs-src/mi-cast, foldered by
// adventure. Stat blocks transcribed from the Missions PDF (verify off renders).
// Run: node tools/gen-actors.mjs && npm run build-packs && npm run validate
import { writeFileSync, mkdirSync } from "node:fs";
import crypto from "node:crypto";

const DIR = "packs-src/mi-cast";
mkdirSync(DIR, { recursive: true });
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);
const STATS = { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.1.0",
  createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null,
  compendiumSource: null, duplicateSource: null, exportSource: null };
const attr = (v) => ({ base: v, mod: 0, value: v, racial: 0 });

const FOLDERS = { influence: { name: "Under the Influence", sort: 100, color: "#3a4a5a" },
                  malpractice: { name: "Malpractice", sort: 200, color: "#3a5a44" } };
const folderId = (k) => sha("mi-cast-folder:" + k);
for (const [k, f] of Object.entries(FOLDERS)) {
  writeFileSync(`${DIR}/_folder_${k}_${folderId(k)}.json`,
    JSON.stringify({ _id: folderId(k), name: f.name, type: "Actor", folder: null,
      sorting: "m", color: f.color, description: "", sort: f.sort, flags: {},
      _key: `!folders!${folderId(k)}` }, null, 2) + "\n");
}

// x: name, folder, b,q,s,c,i,w, e, r (boosted Reaction), initDice, armorB, armorI,
// threat, pro, race, bio (HTML). Initiative base = r.
function npc(x) {
  const id = sha("mi-npc:" + x.name);
  return {
    _id: id, name: x.name, type: "npc", img: "icons/svg/mystery-man.svg",
    system: {
      biography: x.bio, race: x.race || "human", professionalRating: x.pro ?? 2,
      body: attr(x.b), quickness: attr(x.q), strength: attr(x.s),
      charisma: attr(x.c), intelligence: attr(x.i), willpower: attr(x.w),
      essence: { value: x.e ?? 6, max: 6 },
      magic: { value: x.magic || 0, max: x.magic || 0, tradition: "none", type: x.magic ? "full" : "none", totem: "" },
      reaction: { base: 0, mod: 0, value: x.r ?? Math.floor((x.q + x.i) / 2) },
      conditionMonitor: { physical: { value: 0, max: 10, overflow: 0 }, stun: { value: 0, max: 10, overflow: 0 }, overflow: 0 },
      armor: { ballistic: x.armorB || 0, impact: x.armorI || 0 },
      dicePools: { combat: { value: 0, max: 0, bonus: 0 }, magic: { value: 0, max: 0, bonus: 0 } },
      initiative: { base: x.r ?? 0, dice: x.initDice || 1, mod: 0, value: x.r ?? 0 },
      threatRating: x.threat ?? 3, nuyen: 0, movement: { walk: x.q, run: x.q * 3 }
    },
    items: [], effects: [], folder: x.folder ? folderId(x.folder) : null, sort: 0,
    flags: {}, _stats: STATS,
    prototypeToken: { name: x.name, displayName: 0, actorLink: false, width: 1, height: 1,
      texture: { src: "icons/svg/mystery-man.svg", anchorX: 0.5, anchorY: 0.5, offsetX: 0, offsetY: 0, fit: "contain", scaleX: 1, scaleY: 1, rotation: 0, tint: "#ffffff" },
      disposition: -1 },
    ownership: { default: 0 }, _key: `!actors!${id}`
  };
}

const CAST = [
  {
    name: "Lindy (a.k.a. \"Dr. Cuca\")", folder: "influence",
    b: 6, q: 6, s: 4, c: 5, i: 5, w: 4, e: 2.15, r: 10, initDice: 3, armorB: 4, armorI: 3, threat: 4, pro: 3,
    bio: `<p>A Renraku covert operative running the hidden chop shop as cyberdoc "Dr. Cuca," screening the desperate before admitting "patients" to the body shop. Bright, dangerous, and not easily fooled — a capable combatant if cornered.</p>
      <p><strong>Skills:</strong> Firearms 6, Unarmed Combat 6.</p>
      <p><strong>Cyberware:</strong> Retractable Spur, Skillwires Plus (3), Softlink (3), Wired Reflexes (2). <strong>Bioware:</strong> Enhanced Articulation, Orthoskin (3), Trauma Damper.</p>
      <p><strong>Gear:</strong> Form-Fitting Body Armor-2 (3/1), Ares Viper Slivergun (heavy pistol, 9S flechette, SA/BF, 30-round clip); skillsofts — Music (3), Biotech (3), Amazonian Portuguese (3).</p>
      <p><em>Initiative 10 + 3D6. Threat/Professional 4/3. Missions p.12.</em></p>`
  }
];

for (const c of CAST) {
  const w = npc(c);
  const safe = c.name.replace(/[^A-Za-z0-9]+/g, "_");
  writeFileSync(`${DIR}/${safe}_${w._id}.json`, JSON.stringify(w, null, 2) + "\n");
}
console.log(`wrote ${CAST.length} cast NPC(s)`);
