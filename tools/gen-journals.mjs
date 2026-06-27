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
  },

  // ── UNDER THE INFLUENCE ────────────────────────────────────────────────────
  {
    name: "UtI 0 — Setup & Synopsis", folder: "influence", sort: 0,
    pages: [
      page("Premise", `
        <p>Seattle, 2055. <strong>Sergeant Franco Tanner</strong>, a Lone Star undercover officer, infiltrated a heavily-cybered street gang to trace a source of cutting-edge cyberware. Three months in, posing as the fence "Leopard" Leonard, his reports pointed to a back-alley cyberdoc — <strong>"Dr. Cuca"</strong> — and then stopped cold. The team (Lone Star officers, or deniable freelancers hired by Lone Star's Division of Investigation) is sent to find him.</p>
        <p><strong>The secret:</strong> "Dr. Cuca" is a front for a <strong>Renraku</strong> covert program testing illegal <strong>behavioural-control cyberware</strong> on the destitute. The gang's edge is the implants — and Tanner himself has been compromised, which is why he turns up acting strangely. (This is the thread that quietly foreshadows Double Exposure's mind-control horror.)</p>`),
      page("Running It / Getting Started", `
        <p>Best run with the players as Lone Star officers; alternatively freelancers given a Lone Star contact and a cover package (Division of Investigation IDs, six months of DocWagon Platinum, SINs; magicians get SWAT backup). See <em>Shadowrun Companion</em> p.34 for the equipment Edge.</p>
        <p>Two starting leads: <strong>Leopard's Den</strong> (Tanner's hideout) and <strong>Chez Cuca</strong> (the cyberdoc's clinic). Let the players pick the order; both converge on the Renraku body shop. <em>Legwork</em> covers extra inquiries (book p.23).</p>`)
    ]
  },
  {
    name: "UtI 1 — Vanishing Act", folder: "influence", sort: 10,
    pages: [
      page("Read to the Players", `
        <p>Captain Burns looks unhappy today. He always looks unhappy — but today, even more so, and the fact that he's called you into his office this particular morning suggests whatever he has to say will make <em>you</em> unhappy too. He waves you to sit (there are two chairs, and he's in one of them), looks you over a long moment, and finally opens his mouth.</p>
        <p>The job: one of the department's undercover people has gone dark, and the brass wants him found — quietly.</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> A straightforward "find our missing operative" briefing. Convey: Tanner is good at his job, the gang he infiltrated runs <em>state-of-the-art</em> cyberware, and his last reports named a cyberdoc, "Dr. Cuca."</p>
        <p><strong>Behind the Scenes.</strong> Tanner posed as fence "Leopard" Leonard, found the gang within three months, traced their implants to Cuca — then his reports stopped. The team gets cover IDs and basic intel, but Tanner's personnel file is conspicuously <em>not</em> on the network.</p>`),
      page("The Run & Opposition", `
        <p>No opposition in the briefing itself. The team leaves with two leads — Tanner's hideout (<em>Leopard's Den</em>) and the cyberdoc's clinic (<em>Chez Cuca</em>) — and whatever cover the GM issued. Encourage legwork (book p.23) before kicking doors.</p>`),
      page("Dropping Clues & Debugging", `
        <p>Little can go wrong here. Keep the goal clear — <strong>locate Tanner</strong> — and don't let players over-analyse the cover package. If they head for the clinic first, go to <em>Chez Cuca</em>; for the hideout, <em>Leopard's Den</em>.</p>`)
    ]
  },
  {
    name: "UtI 2 — Leopard's Den", folder: "influence", sort: 20,
    pages: [
      page("Read to the Players", `
        <p>So this is where Tanner holes up slumming it as "Leopard" Leonard: the <strong>Solomon Arms</strong>, a four-storey hotel that's seen better decades but isn't the worst squat you've crossed. The desk clerk actually looks up as you enter. Tanner's "suite" is on the third floor — closed, locked, no sign of forced entry, and quiet inside.</p>
        <p><em>Once inside:</em> nobody's home, alive or otherwise. The place is a slob's nest — dirty socks and Nuke-It Burger wrappers everywhere — but it's ordinary day-to-day mess, no struggle, no foul play. The kitchen garbage is full but hasn't started to stink, so he's been gone maybe a day. The telecom holds no messages; old ones were erased or hidden in storage memory. Not much to go on.</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> The hideout should feel like a dead end — the only thread is the telecom, and even that's thin. The real curve ball is that <strong>Tanner may turn up</strong> while they're there, acting erratically, with bizarre mood swings. Let his behaviour tip the players that something is wrong without spelling it out.</p>
        <p><strong>Behind the Scenes.</strong> Getting in is the first puzzle — knocking gets no answer, breaking in risks attention, asking the clerk for the key risks blowing Tanner's cover and weeks of undercover work. Tanner's strangeness is the first symptom of the control cyberware.</p>`),
      page("The Run & Opposition", `
        <p>No direct opposition — this is an investigation beat. If Tanner appears, play his mood swings for unsettling effect, not combat. Anything that draws attention to him or the team can damage the case.</p>`),
      page("Dropping Clues & Debugging", `
        <p>Don't give too much away too soon. Mine the humour in Tanner's mood swings, but keep it under control. If the players stall, the wiped telecom + the cyberdoc lead from the briefing points them to <em>Chez Cuca</em>.</p>`)
    ]
  },
  {
    name: "UtI 3 — Chez Cuca", folder: "influence", sort: 30,
    pages: [
      page("Read to the Players", `
        <p>"Dr. Cuca's" chop shop hides beneath <strong>MindSound Music</strong>, a legit-enough store fronting a warren of cover businesses — a cheap-electronics outlet, an Amazonian café. The body shop sits below, screened behind layers of misdirection and a fast-talking receptionist who runs surveillance on everyone who walks in.</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> The store runs on several layers of deceit. Following the cyberdoc thread (legally or not) eventually exposes the hidden clinic.</p>
        <p><strong>Behind the Scenes.</strong> "Dr. Cuca" is <strong>Lindy</strong>, a Renraku covert operative who screens the desperate before admitting "patients." The chop shop is a front for Renraku's underground program testing illegal <strong>behavioural-control cyberware</strong> — the gang's edge, and what compromised Tanner. Lindy is bright and not easily fooled.</p>`),
      page("The Run & Opposition", `
        <p>The team must get past Lindy and into the clinic — talk, deception, or force. <strong>Lindy</strong> (see the Cast compendium) is a capable combatant (Wired-2, Orthoskin, Viper Slivergun) and will fight if cornered. Penetrating the clinic opens the way to the Renraku research (<em>Whose Side Are You On?</em>) and to <em>Decking the Doctor</em> if a decker hits Cuca's Matrix system.</p>`),
      page("Dropping Clues & Debugging", `
        <p>Lindy's screening is the gate. If the team can't talk their way in, the music-store cover, the surveillance gear, and the underground access all reward legwork and a quiet approach over a frontal one.</p>`)
    ]
  }
];

for (const j of JOURNALS) {
  const w = journal(j);
  const safe = j.name.replace(/[^A-Za-z0-9]+/g, "_");
  writeFileSync(`${DIR}/${safe}_${w._id}.json`, JSON.stringify(w, null, 2) + "\n");
}
console.log(`wrote ${JOURNALS.length} journal(s) + ${Object.keys(FOLDERS).length} folders`);
