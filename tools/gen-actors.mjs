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
      disposition: x.disp ?? -1 },
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
  },

  // ── MALPRACTICE ────────────────────────────────────────────────────────────
  {
    name: "Seth Palatine", folder: "malpractice", disp: 0,
    b: 4, q: 5, s: 3, c: 3, i: 4, w: 5, e: 6, r: 4, initDice: 1, armorB: 5, armorI: 3, threat: 2, pro: 3,
    bio: `<p>Balding, business-like leader of DocWagon Expert Team Three, a devout Muslim who reads the Koran and masks his feelings. Born mid-2010s; lost his father and two sisters to VITAS-II, raised poor by his mother on government aid. A paramedic since Seattle's Nordstrom Clinic (bought by DocWagon in 2043), he was among the first responders when a <strong>Sons of Sauron</strong> bomb tore through the Ork Underground in 2049 (38 dead) — Metroplex Guardsmen kept him from the dying, and his ailing mother was among the wounded and soon died. He has never forgiven the Sons. Twenty years on the front line show in his worry-lined face. <em>Not the mole.</em></p>
      <p><strong>Skills:</strong> Armed Combat 1 [Clubs 3, AZ-150 Stun Baton 5], Athletics 3, Biology 2 [Medicine 4], Biotech 6, Car 3, Cybertechnology 3, Etiquette (Corporate) 3, Etiquette (DocWagon) 5, Etiquette (Street) 3, Firearms 2 [Light Pistols 4, Beretta 110-T 6], Gunnery 1 [Vehicle Cannons 3], Leadership 2 [Commercial 4], Negotiation 1 [Fast Talk 3], Unarmed Combat 2 [Subduing Combat 4], Urban Stealth 3.</p>
      <p><strong>Bioware:</strong> Orthoskin (2) [+1 Ballistic/+1 Impact — total 6/4 with jacket]. <strong>Gear:</strong> AZ-150 Stun Baton [6S Stun], Beretta 110-T [light pistol, 12 clip, SA, gel 4L Stun, 3 spare clips], DocWagon Armor Jacket (5/3), DocWagon Kit, Flash-Pak, Micro Flare, Chrysler-Nissan Jackrabbit.</p>
      <p><em>Initiative 4 + 1D6. Threat/Professional 2/3. Body Index 1. Missions p.48.</em></p>`
  },
  {
    name: "Vivianne \"Viv\" Geldhausmann", folder: "malpractice", disp: 0,
    b: 3, q: 3, s: 3, c: 5, i: 4, w: 4, e: 6, r: 3, initDice: 1, armorB: 5, armorI: 3, threat: 2, pro: 2,
    bio: `<p>Team Three's psychiatrist — short red hair, warm smile, a slight limp from a gunshot to the leg taken pulling a client out of a gang war. Graduated eighth in her class at Cambridge; specialises in cyberpsychosis but fills in ably as a medic. Her cheer keeps the team sane amid daily horrors, though it dimmed after 2051, when her husband <strong>Jacob</strong> — a photojournalist and Lone Star "cybersnoop" — was murdered during the Ancients gang war for the crime footage that cleared the Ancients of starting it. His murder was never solved; she still wears his ring on a necklace. <em>Not the mole.</em></p>
      <p><strong>Skills:</strong> Armed Combat 1 [Clubs 3, AZ-150 Stun Baton 5], Athletics 3, Biology 1 [Medicine 3], Biotech 4, Car 2, Cybertechnology 2, Etiquette (Corporate) 2, Etiquette (DocWagon) 5, Etiquette (Street) 3, Firearms 1 [Light Pistol 3, Ares Crusader MP 5], Negotiation 5, Psychology 5, Unarmed Combat 1 [Subduing Combat 3], Urban Stealth 2.</p>
      <p><strong>Gear:</strong> Ares Crusader MP [light pistol, 40 clip, SA/BF, gel 4L Stun, 2 spare clips], AZ-150 Stun Baton [6S Stun], DocWagon Armor Jacket (5/3), DocWagon Kit, Flash-Pak, Micro Flare, necklace looped through a man's ring.</p>
      <p><em>Initiative 3 + 1D6. Threat/Professional 2/2. Missions p.49.</em></p>`
  },
  {
    name: "Gordon \"Hawkeye\" Kurtz", folder: "malpractice", disp: 0,
    b: 5, q: 5, s: 4, c: 4, i: 2, w: 4, e: 6, r: 3, initDice: 1, armorB: 5, armorI: 3, threat: 3, pro: 3, magic: 6,
    bio: `<p>A jovial, wisecracking ladies' man who looks eighteen despite being in his late twenties — and a secret <strong>physical adept</strong>. Ex-Crashcart, hired by DocWagon in late 2052, he found the job even more time-consuming and started leaning on <strong>stimulants</strong> to party through 15–20-hour days on ten of sleep a week. To pay his dealers he <strong>embezzles money and supplies from DocWagon</strong> — a real secret, but not the one the team is hunting. When his dose wears off he turns bitter and mean, picking on one person until he's near a punch in the mouth. <em>Not the mole — but a red herring with plenty to hide.</em></p>
      <p><strong>Adept Powers:</strong> Combat Sense (2), Improved Body (2) [Body 5→7], Pain Resistance (1). <strong>Skills:</strong> Armed Combat 1 [Clubs 3, AZ-150 Stun Baton 5], Athletics 5, Biotech 5 [First Aid 7], Car 3, Firearms 2 [Heavy Pistol 4, Ares Predator II 6], Gunnery 1 [Vehicle Cannons 3], Etiquette (Corporate) 3, Etiquette (DocWagon) 3, Etiquette (Street) 4, Negotiation 3 [Fast Talk 5], Unarmed Combat 2 [Subduing Combat 4], Urban Stealth 3.</p>
      <p><strong>Gear:</strong> Ares Predator II [heavy pistol, 15 clip, SA, gel 7M Stun, 3 spare clips], AZ-150 Stun Baton [6S Stun], DocWagon Armor Jacket (5/3), DocWagon Kit, Flash-Pak, Micro Flare, Eurocar Westwind 2000 (notched dashboard).</p>
      <p><em>Initiative 3 + 1D6. Threat/Professional 3/3 (+2 dice from Combat Sense). Missions p.49.</em></p>`
  },
  {
    name: "Shawn Ferrer", folder: "malpractice", disp: 0, race: "dwarf",
    b: 4, q: 3, s: 4, c: 2, i: 3, w: 4, e: 1.4, r: 3, initDice: 1, armorB: 5, armorI: 3, threat: 3, pro: 3,
    bio: `<p><strong>The default mole.</strong> A dwarf rigger who grew up "a respectable halfer" in the CAS and served as a CAS-military transport pilot from 2048. In mid-2051 his hovercraft was capsized by Caribbean League pirates off Florida; he nearly drowned and came to believe his human squadmates let him die for being a dwarf — leaving him <strong>claustrophobic</strong> (except when rigging) and quietly bitter. He had plastic surgery to make his ears look "human," joined DocWagon as a rigger + paramedic in 2053, and was assigned to Expert Team Three. Soft-spoken, rarely meets your eyes, forever practising yo-yo tricks. Sells DocWagon DNA and medical records to <strong>Brown</strong>. (GM may swap the mole; his fabricated bio still lists him as a dwarf — a legwork tell.)</p>
      <p><strong>Skills:</strong> Armed Combat 1 [Edged Weapons 3, Knife 5], Biotech 1 [First Aid 3], Car 3, Electronics 1 [Diagnostics 3], Etiquette (DocWagon) 3, Firearms 2 [Pistols 4], Gunnery 4, Hovercraft 1 [Transport 3], Military History 2 [CAS 4], Rotorcraft 3, Stealth (Urban) 3, Stealth (Wilderness) 3, Unarmed Combat 1 [Escrima 3], Vectored Thrust 1 [VTOL 3], Yo-yo 3 [Trick Yo-yoing 5].</p>
      <p><strong>Cyberware:</strong> Datajack, Commlink IV, Crypto Circuit HD (4), Orientation System, Telephone, Vehicle Control Rig (2). <strong>Bioware:</strong> Cerebral Booster (1) [Int 3→4], Orthoskin (1) [+1 Impact].</p>
      <p><strong>Gear:</strong> Hammerli 610S [heavy pistol, 6 clip, SA, gel 4L Stun, 3 spare clips], AZ-150 Stun Baton [6S Stun], DocWagon Armor Jacket (5/3), DocWagon Kit, Flash-Pak, Micro Flare, Red Ryder Yo-yo.</p>
      <p><em>Initiative 3 + 1D6 (7 + 3D6 when rigging). Threat/Professional 3/3. Body Index 0.9. Missions p.50.</em></p>`
  },
  {
    name: "Earl Brown", folder: "malpractice", disp: -1,
    b: 5, q: 6, s: 2, c: 4, i: 4, w: 3, e: 0.6, r: 6, initDice: 2, armorB: 5, armorI: 3, threat: 5, pro: 4,
    bio: `<p><strong>The villain and recurring Enemy.</strong> Joined the UCAS Army in the early 2040s and volunteered as a test subject for an experimental <strong>cybernetic tactical computer</strong>, using laser designator and orientation system to guide bombs and missiles with pinpoint accuracy on black-ops jobs. A drunken brawl in which he permanently crippled a dwarf Air Force officer (a senator's son) got him dishonorably discharged and two years in federal prison. He resurfaced as a front man buying DNA samples — first hitting DocWagon clinics with brute force and headlines (the ambush that "killed" Doctor Bob's team), later turning subtle to survive his employers. Years of the tactical computer in his skull have made him as cold and calculating as its subroutines; he speaks only in ambiguities. Deadly with rifle, knife, and interrogation.</p>
      <p><strong>Skills:</strong> Armed Combat 1 [Edged 3, Knife 5], Athletics 2 [Running 4], Car 3, Electronics 2 [Linking 4], Electronics (B/R) 3, Etiquette 3, Firearms 6 [Rifles 8, Barret 121 10], Gunnery 4 [Missile/Rocket Launcher 6], Interrogation 6 [Torture 8], Leadership 2 [Tactics 4], Military Theory 2 [Tactics 4], Negotiation 1 [Bargain 3], Psychology 1, Stealth 5, Throwing Weapons 2 [Non-Aero 4, Grenades 6], Unarmed Combat 5.</p>
      <p><strong>Cyberware:</strong> Boosted Reflexes (1), Cybereyes (Display Link, Thermographic, Rangefinder), Datajack, Orientation System, Smartlink II, Tactical Computer (1). <strong>Bioware:</strong> Damage Compensators (6), Enhanced Articulation, Muscle Augmentation (1), Tailored Pheromones (2), Trauma Damper. (Augmented: Q7 S3 C6 R6.)</p>
      <p><strong>Gear:</strong> Barret Model 121 [sniper, 14 clip, SA, APDS 14D, spare clip] in a Fuchi-7 case; Colt Cobra [SMG, 32 clip, SA/BF/FA, APDS 6M, 3 spare clips]; Cougar Fine Blade Knife [3M]; Camouflage Jacket (5/3, urban); Smartgoggles; 2 AFR-7 flash grenades.</p>
      <p><em>Initiative 5 (6) + 1D6 (2D6). Threat/Professional 5/4. Body Index 3.6. Missions p.51.</em></p>`
  },
  {
    name: "Robert \"Doctor Bob\" Khamdeng", folder: "malpractice", disp: 1,
    b: 3, q: 4, s: 3, c: 4, i: 4, w: 5, e: 5, r: 4, initDice: 1, armorB: 0, armorI: 0, threat: 2, pro: 3, magic: 4,
    bio: `<p><strong>The employer.</strong> Hired as a DocWagon paramedic in 2043, Robert Khamdeng built a reputation for heroism — and racked up fines for rescuing non-clients — until KNUS turned him into media darling "Doctor Bob" (a nationwide "Korp Kudos" segment, a Time-Ares cover) in 2047. In September 2054 the man <strong>Brown</strong> offered to buy DocWagon clients' DNA and medical histories; Bob refused, and three days later his rookie HTR team was rocket-ambushed and wiped out — Bob the sole survivor by luck. He let the world think him dead and slipped into the shadows as a freelance shadowrunner (rumoured to be a shaman). Now, poor but driven, he hires the team to unmask the mole still feeding Brown from inside DocWagon.</p>
      <p><em>No published combat stat block (support NPC — attributes here are an estimate for a veteran shadowrunning ex-paramedic; treat as GM's discretion). Legwork: Missions p.46. Brief bio drawn from Missions p.26–33.</em></p>`
  },
  {
    name: "Liz Yamato", folder: "malpractice", disp: 1,
    b: 4, q: 4, s: 4, c: 4, i: 5, w: 5, e: 6, r: 4, initDice: 1, armorB: 4, armorI: 3, threat: 3, pro: 3, race: "dwarf",
    bio: `<p><strong>The handler.</strong> A dwarf agent of DocWagon's <strong>Internal Security Division</strong> and Doctor Bob's old friend, who traced the leak to Expert Team Three. She recruits the team as Temporary Response Personnel, runs their 48-hour crash-course, checks in each afternoon for evidence, and arrives with ISD muscle to take the exposed mole away. She takes the job dead seriously — one wrong move blows DocWagon's security, the mole, and her career. Introduces herself at the Renton Clinic Citymaster with the counter-sign: "Any of you need a shot of <em>Morphine</em>?"</p>
      <p><em>No published stat block (support NPC — attributes here are an estimate for a capable ISD field agent; GM's discretion). Appears throughout Malpractice (Missions p.33–45).</em></p>`
  }
];

for (const c of CAST) {
  const w = npc(c);
  const safe = c.name.replace(/[^A-Za-z0-9]+/g, "_");
  writeFileSync(`${DIR}/${safe}_${w._id}.json`, JSON.stringify(w, null, 2) + "\n");
}
console.log(`wrote ${CAST.length} cast NPC(s)`);
