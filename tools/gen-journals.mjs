// Generate Missions GM journals into packs-src/mi-journals. Each record is one
// JournalEntry (a scene/encounter or campaign note) with pages of HTML text.
// Run: node tools/gen-journals.mjs && npm run build-packs && npm run validate
import { writeFileSync, mkdirSync } from "node:fs";
import crypto from "node:crypto";

const DIR = "packs-src/mi-journals";
mkdirSync(DIR, { recursive: true });
const sha = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 16);
const STATS = { coreVersion: "13.351", systemId: "sr2e", systemVersion: "0.1.0",
  createdTime: 1781600000000, modifiedTime: 1781600000000, lastModifiedBy: null,
  compendiumSource: null, duplicateSource: null, exportSource: null };

// Folders by adventure (compendium folders inside the pack).
const FOLDERS = {
  campaign:   { name: "Campaign — Double Exposure Integration", sort: 0,   color: "#4a3a5a" },
  influence:  { name: "Under the Influence", sort: 100, color: "#3a4a5a" },
  malpractice:{ name: "Malpractice", sort: 200, color: "#3a5a44" }
};
const folderId = (k) => sha("mi-journal-folder:" + k);
for (const [k, f] of Object.entries(FOLDERS)) {
  writeFileSync(`${DIR}/_folder_${k}_${folderId(k)}.json`,
    JSON.stringify({ _id: folderId(k), name: f.name, type: "JournalEntry", folder: null,
      sorting: "m", color: f.color, description: "", sort: f.sort, flags: {},
      _key: `!folders!${folderId(k)}` }, null, 2) + "\n");
}

function page(name, html, level = 1) {
  return {
    _id: sha("mi-page:" + name + html.slice(0, 40)), name, type: "text",
    title: { show: true, level }, image: {}, video: { controls: true, volume: 0.5 },
    src: null, text: { format: 1, content: html }, system: {}, sort: 0,
    ownership: { default: -1 }, flags: {}, _stats: STATS
  };
}

function journal(x) {
  const id = sha("mi-journal:" + x.name);
  return {
    _id: id, name: x.name, pages: x.pages, folder: x.folder ? folderId(x.folder) : null,
    sort: x.sort ?? 0, flags: {}, ownership: { default: 0 }, _stats: STATS,
    _key: `!journal!${id}`
  };
}

// ── JOURNALS ───────────────────────────────────────────────────────────────────
const JOURNALS = [
  {
    name: "Filling Double Exposure's Gaps", folder: "campaign", sort: 0,
    pages: [
      page("Why & Where", `
        <p><em>Double Exposure</em> opens episodically: the team runs standalone jobs for the same fixer while the Project Hope thread slowly surfaces. The book spaces these out — segment 2 literally opens <em>"a couple of real-time weeks after the last job."</em> Those early gaps (between DE segments 1–3) are downtime windows you can fill with a self-contained run before the team gets pulled into the camps. Once they commit to Project Hope (DE segment 4+, they're inside the camp), there's no room for unrelated side-jobs.</p>
        <p>The two Seattle adventures in <em>Missions</em> slot in cleanly. The other two (<em>Mission: Mars</em>, off-world AresSpace conspiracy; <em>King of the Mountain</em>, UCAS Special Forces in Alaska) are a different campaign frame and are not meant as DE inserts.</p>`),
      page("Slot 1 — Under the Influence (between DE seg 1 → 2)", `
        <p><strong>Where:</strong> the first downtime gap, before the team has any inkling of Project Hope.</p>
        <p><strong>Hook:</strong> a straightforward Seattle investigation — a missing Lone Star undercover officer who vanished tailing a heavily-cybered street gang. Standard runner work; no DE connection needed.</p>
        <p><strong>Why it fits:</strong> same city, same kind of team, same investigative beat. The villain's <strong>Aztechnology behavioural-control cyberware</strong> — ordinary people remade into someone else's puppets — quietly <em>rhymes</em> with DE's insect-spirit body-horror without spoiling it. Run it straight and your players will feel the echo later. Pure foreshadowing.</p>`),
      page("Slot 2 — Malpractice (after DE seg 2)", `
        <p><strong>Where:</strong> the gap after DE segment 2 (the DocWagon sample-case milk run).</p>
        <p><strong>Hook — built in:</strong> DE segment 2 already puts the team in business with <strong>DocWagon</strong>. That same contact brings them the Malpractice job: go undercover as DocWagon High-Threat-Response medics to flush out a mole who's selling <strong>medical records and DNA samples</strong> to an outside buyer.</p>
        <p><strong>Why it fits:</strong> Seattle, a runner team, and a <strong>medical / bio-data-theft</strong> theme that dovetails with DE's later medical-center segment and Renraku's off-the-books bio-experiments. You can even leave the "mysterious outside buyer" deliberately vague — a GM who wants tighter integration can imply a Renraku or Universal Brotherhood fingerprint.</p>`),
      page("Not for DE — Mars & King of the Mountain", `
        <p><strong>Mission: Mars</strong> — the PCs are AresSpace security agents untangling a Mars-mission cover-up tied to Dunkelzahn's will. Off-world setting, epic conspiracy scope, sci-fi tone. Cannot drop into a Seattle downtime gap.</p>
        <p><strong>King of the Mountain</strong> — the PCs are <em>UCAS Special Forces</em> (not shadowrunners) assaulting an Alaskan mountain fortress held by a Humanis death cult. Wrong PC type, location, and premise for a runner campaign.</p>
        <p>Both are solid adventures — just for a different table/campaign, not DE inserts.</p>`)
    ]
  }
];

for (const j of JOURNALS) {
  const w = journal(j);
  const safe = j.name.replace(/[^A-Za-z0-9]+/g, "_");
  writeFileSync(`${DIR}/${safe}_${w._id}.json`, JSON.stringify(w, null, 2) + "\n");
}
console.log(`wrote ${JOURNALS.length} journal(s) + ${Object.keys(FOLDERS).length} folders`);
