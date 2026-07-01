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
  },
  {
    name: "Sgt. Franco Tanner", folder: "influence",
    b: 4, q: 5, s: 4, c: 4, i: 5, w: 5, e: 3.03, r: 6, initDice: 2, armorB: 4, armorI: 3, threat: 4, pro: 3,
    bio: `<p>An honest, hard-working, dedicated Lone Star undercover officer who broke up several major gangs before vanishing into this one. Missing since his last reports named "Dr. Cuca." When the players find him he is a puppet: his control cyberware drops him to <strong>Threat/Professional 2/4</strong> and turns him on his own side.</p>
      <p><strong>Skills:</strong> Car 2, Etiquette (Street) 5, Firearms 4, Negotiation 3, Police Procedure 4, Psychology 2 [Group Behavior 4], Stealth 4, Unarmed Combat 3 [Subduing 5].</p>
      <p><strong>Cyberware:</strong> Boosted Reflexes (2), Headware Radio (subdermal speakers, alpha), Skillwires Plus (3), Smartlink.</p>
      <p><strong>Gear:</strong> Browning Ultra-Power (heavy pistol, 10-round clip, SA, 9M) with concealed holster + 2 spare clips; Securetech Ultra-Vest (4/3).</p>
      <p><em>Initiative 6 + 2D6. Missions p.24.</em></p>`
  },
  {
    name: "Dr. Cuca (Dr. Claudio Andrade)", folder: "influence",
    b: 3, q: 4, s: 2, c: 3, i: 6, w: 5, e: 6, r: 5, initDice: 1, armorB: 0, armorI: 0, threat: 1, pro: 2,
    bio: `<p>The Amazonian expatriate scientist behind "Dr. Cuca." His research into simsense conditioning and cybernetic behaviour modification could have made him a leading name — if he'd been more careful about how he obtained test subjects. When one turned out to be the São Paulo mayor's cousin he fled Amazonia, and Renraku happily hired him. The Futuremen are his first field test. Brilliant but narrowly focused, occasionally manic — a clever opponent, not a raving mad scientist. He carries <strong>no cyberware</strong>, all too aware how easily implants can be turned against their owner.</p>
      <p><strong>Skills:</strong> Biology 4 [Medicine 6], Biotech 4 [Transimplant Surgery 6], Computer 3, Cybertechnology 6, Etiquette (Corporate) 3, Interrogation 4, Psychology 7, Unarmed Combat 3.</p>
      <p><strong>Gear:</strong> Wrist computer, 800 Mp. <em>Initiative 5 + 1D6. Threat/Professional 1/2. Missions p.25.</em></p>`
  },
  {
    name: "Marcus Powell", folder: "influence",
    b: 3, q: 3, s: 3, c: 7, i: 5, w: 4, e: 5.5, r: 6, initDice: 1, armorB: 3, armorI: 3, threat: 2, pro: 2,
    bio: `<p>The chief Renraku officer over the Futuremen project — an ambitious climber who keeps Cuca and the staff on a tight leash. He spends much of his time off-site chasing funding and glory, but drops in often to watch everyone. Not liked by the project personnel, and he doesn't care. He runs the endgame: the data-wipe and the demolition charges.</p>
      <p><strong>Skills:</strong> Computer 4, Etiquette (Corporate) 5 [7], Firearms 3, Leadership 3 [5], Negotiation 4 [6]. <strong>Bioware:</strong> Tailored Pheromones (2). <strong>Cyberware:</strong> Datajack (4), 75 Mp headware memory.</p>
      <p><strong>Gear:</strong> Morrissey Elite (heavy pistol, 5-round clip, SA, 9M) + concealed holster; Vashon Island "Houndstooth" armoured suit (3/3); telecom, 200 Mp.</p>
      <p><em>Initiative 4 + 1D6. Threat/Professional 2/2 (Charisma 7 with pheromones). Missions p.25.</em></p>`
  },
  {
    name: "Futureman (Human)", folder: "influence",
    b: 5, q: 6, s: 5, c: 3, i: 3, w: 3, e: 1.88, r: 9, initDice: 2, armorB: 5, armorI: 3, threat: 2, pro: 4,
    bio: `<p>A heavily-cybered Futuremen ganger (alpha-grade 'ware). Mix and match metatypes and loadouts across the gang. <strong>Skills:</strong> Firearms 5, Unarmed Combat 4.</p>
      <p><strong>Cyberware (alpha):</strong> Cyberarm (+2 Strength, +2 Quickness), Cyber-shotgun, Retractable Spur, Cybereyes (Low-Light, Thermographic), Headware Radio (subdermal speakers), Reaction Enhancer (2), Smartlink, Wired Reflexes (1).</p>
      <p><strong>Gear:</strong> Secure Jacket (5/3), Ares Predator (heavy pistol, 15-round clip, SA, 9M), cyber-shotgun (8-round magazine, SA, 10S). <em>Initiative 9 + 2D6. Threat/Professional 2/4. Missions p.18.</em></p>`
  },
  {
    name: "Futureman (Ork)", folder: "influence",
    b: 7, q: 6, s: 8, c: 1, i: 2, w: 2, e: 2.28, r: 9, initDice: 2, armorB: 5, armorI: 3, threat: 2, pro: 4, race: "ork",
    bio: `<p>An ork Futuremen ganger — muscle with alpha-grade 'ware and bioware. <strong>Skills:</strong> Firearms 5, Unarmed Combat 5. (Body Index 2.0.)</p>
      <p><strong>Cyberware (alpha):</strong> Headware Radio (subdermal speakers), Retractable Spur, Smartlink II, Wired Reflexes (2). <strong>Bioware:</strong> Enhanced Articulation, Muscle Augmentation (2), Trauma Damper.</p>
      <p><strong>Gear:</strong> Armored Jacket (5/3), Ares Predator (heavy pistol, 15-round clip, SA, 9M), Uzi III (SMG, 24-round clip, BF, 6M). <em>Initiative 9 + 2D6. Threat/Professional 2/4. Missions p.18.</em></p>`
  },
  {
    name: "Futureman (Dwarf)", folder: "influence",
    b: 8, q: 6, s: 7, c: 2, i: 2, w: 3, e: 1.12, r: 8, initDice: 3, armorB: 7, armorI: 5, threat: 2, pro: 4, race: "dwarf",
    bio: `<p>A dwarf Futuremen ganger — tough and hard to drop, with heavy cyber (Body Index 3). <strong>Skills:</strong> Firearms 5, Unarmed Combat 5.</p>
      <p><strong>Gear/'ware:</strong> heavy armour (7/5) and alpha-grade combat cyberware in the Futuremen pattern (Wired Reflexes, Smartlink, cyber-weapon). <em>Initiative 8 + 3D6. Threat/Professional 2/4. Missions p.18.</em></p>`
  }
];

for (const c of CAST) {
  const w = npc(c);
  const safe = c.name.replace(/[^A-Za-z0-9]+/g, "_");
  writeFileSync(`${DIR}/${safe}_${w._id}.json`, JSON.stringify(w, null, 2) + "\n");
}
console.log(`wrote ${CAST.length} cast NPC(s)`);
