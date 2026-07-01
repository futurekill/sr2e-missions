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
  },
  {
    name: "UtI 4 — Decking the Doctor", folder: "influence", sort: 40,
    pages: [
      page("Read to the Players", `
        <p>Optional Matrix angle. A decker can run into Cuca's system to find Tanner without kicking any physical doors — but the ice runs unusually heavy for a music store, and time in the machine is time the meat body isn't watching its back.</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> Like <em>Chez Cuca</em>, this offers a bloodless route to Tanner — and a chance to notice that the "music store" is guarded far too well.</p>
        <p><strong>Behind the Scenes.</strong> The MindSound / "Futuremen" network: <strong>Host A</strong> (Green) runs MindSound's accounting plus the falsified chop-shop books; <strong>Host B</strong> (Green) covers the Café do Amazonia & Kennedy's Cheap Electronics fronts — whose books hold the tells (a no-frills café ordering four dozen Portuguese linguasofts; Kennedy's re-ordering cyber-radio implants it never sells); <strong>Host C</strong> (Red — the "gold mine") holds the Futuremen project and the Renraku control commands. Easiest lead: crack Tanner's telecom. Cracking the body-shop files (not the music files) trips a Bouncer.</p>`),
      page("Security Sheaves (GM reference)", `
        <p><strong>MindSound / Host A — Green (6/8/10/8/9/10):</strong> 6 Probe-5 · 11 Probe-5 · 16 Jammer-7 (Passive Alert) · 20 Bouncer (upgrade Security Code to Orange-8) · 24 Cascading Jam-Rip-6 · 27 Trap-Trace-8 (Blaster-6) · 30 Active Alert · 33 Expert Sparky-8 (Offense +2) · 36 Shutdown.</p>
        <p><strong>Café / Kennedy's — Host B:</strong> 6 Probe-6 · 12 Trace-8 (Passive Alert) · 18 Jam-Rip-8 (Passive Alert) · 22 Tar Pit-10 · 25 Active Alert: Trace-10 · 29 Construct (Armor, Shifting) / Blaster-5 · Mark-Rip-5 · 34 Shutdown.</p>
        <p><strong>Futuremen project / Host C — Red (10/13/9/15/16/16/13):</strong> 6 Cascading Mark-Rip-8 (Shield) · 8 Trap-Trace-10 (Sparky-8) · 8 Passive Alert: Construct (Armor) / Probe-6 / Trace-6 / Killer-6 · 11 Cascading Sparky-10 · 13 Active Alert: a Renraku decker arrives in 2D6 turns · 17 Expert Black IC-8 (Offense −2) · 21 Party IC (Acid/Bind/Jam/Mark-Rip-5) · 25 Cascading Black IC-10 · 29 Shutdown.</p>`),
      page("Dropping Clues & Debugging", `
        <p>Adjust the ice to your decker's weight — feed leads if they're stuck, hold back if they're cruising. No decker? If they ask Lone Star GridSec to run it, gauge how much help they need: drag your feet if they're doing fine, or turn up "hints of something big at the body shop" if they're lost.</p>`)
    ]
  },
  {
    name: "UtI 5 — Whose Side Are You On?", folder: "influence", sort: 50,
    pages: [
      page("Read to the Players", `
        <p>Tanner's quiet as you drive out to his contact's meet — still off, still not himself. You pull up to an abandoned warehouse near <strong>Green Lake</strong>, a garden spot so dead even the rats have left. Tanner leads you down a puddled alley, glancing around; there's no sign of his contact. Then footsteps — from the far end, then behind you, then everywhere. Either the contact has a badly split personality or you've walked into an ambush. Tanner realises it too — he's clawing for his Browning. Trouble is, he's pointing it at <em>you</em>.</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> This is the gut-punch: if the players hadn't twigged that Tanner is compromised, they do now — outnumbered, outgunned, an enemy in their own midst. The ambush can also be staged at the music shop, the clinic, or Tanner's apartment; adapt as your game demands.</p>
        <p><strong>Behind the Scenes.</strong> In a panic, Cuca has sent ~ten <strong>Futuremen</strong> to erase the team (not realising that killing cops guarantees the investigation lives on). Tanner's control cyberware turns him against them. See the Ambush Site map.</p>`),
      page("The Run & Opposition", `
        <p>Use about <strong>1.5 Futuremen per PC (round up) plus Tanner</strong> for a fair, tough fight; two per PC for a hard one. Mix metatypes — a sample ten-man party: five humans, two orks, an elf, a dwarf, a troll. The <strong>Futureman</strong> variants (Human / Ork / Dwarf) are in the Cast compendium — heavily cybered with Wired Reflexes, smartlinks and cyber-shotguns. Tanner (Cast) fights at his reduced control rating (Threat 2/4). Try to leave Tanner and at least one Futuremen alive for questioning.</p>`),
      page("Dropping Clues & Debugging", `
        <p>The team is meant to survive and escape (or win) — scale the Futuremen count to your table. Capturing Tanner or a Futureman gives them the thread to the clinic and the raid. If it's going too easy, more chrome walks out of the shadows.</p>`)
    ]
  },
  {
    name: "UtI 6 — This May Sting a Little", folder: "influence", sort: 60,
    pages: [
      page("Read to the Players", `
        <p>Enough is enough — time to make this Cuca flatliner pay. Private army in the streets is bad; bagging a fellow officer is the thing the Star does not tolerate. As you check your sidearm, you secretly hope the mad doctor's dumb enough to resist arrest.</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> The arrest can be a show-of-force surrender or a guns-blazing assault. The team has every reason to want Cuca dead — but they need him <em>alive</em> to reach the bigger fish (Renraku). That tension is good roleplaying amid the gunfire.</p>
        <p><strong>Behind the Scenes.</strong> By now the team should peg the clinic as the Futuremen's source and bring backup — negotiate a Fast Response Team; Lone Star's Dept. of Paranormal Investigation may loan a combat mage and GridSec a decker (use the <em>Whose Side Are You On?</em> stat blocks if the team lacks either). The underground complex links every building on the block, giving Renraku routes to flee. Site-boss <strong>Marcus Powell</strong> (Cast) runs the endgame.</p>`),
      page("The Run & Opposition", `
        <p>Use the <em>Chez Cuca</em> map + NPCs (Lindy, Futuremen) plus <strong>Powell</strong> and <strong>Dr. Cuca / Andrade</strong> (Cast). Run it on a clock from the moment the team escapes/defeats the ambush (~10 minutes to the clinic, sirens up): Renraku trucks and staff flee the instant visible Lone Star arrives; if the team looks likely to overrun the place, Powell starts the <strong>data-wipe</strong> before all the top-secret data reaches Renraku; if too much evidence remains when the cops close in, he <strong>detonates the charges</strong> early. Radioing Lone Star for immediate deckers / an astral mage can disrupt his timeline.</p>`),
      page("Dropping Clues & Debugging", `
        <p>Give the team a fair shot at taking Cuca and company unless they truly dawdle. A team decker who jacks in "just in time" watches the last Futuremen data vanishing toward Renraku's mainframe (don't let them ID the destination) and can grab a little evidence before the wipe finishes. Let a personally-invested PC confront the doctor.</p>`)
    ]
  },
  {
    name: "UtI 7 — Picking Up the Pieces", folder: "influence", sort: 70,
    pages: [
      page("Resolution", `
        <p>With Cuca (Andrade) taken or killed and the Futuremen broken, the team walks out with a compromised officer recovered and a chop shop shut down. If they kept the doctor alive and grabbed evidence before Powell's wipe, they have a thread pointing at <strong>Renraku</strong> — but proving a megacorp bankrolled illegal behavioural-cyberware experiments is another campaign's worth of trouble. Renraku scrubs its fingerprints; Lone Star is happy to close the gang case and unhappy to chase the corp.</p>`),
      page("Aftermath & DE Tie-in", `
        <p><strong>Tanner:</strong> if recovered alive, the control cyberware has to come out — a grim reminder that the implants that make a runner strong can be turned against them. <strong>Payment / commendation</strong> as befits Lone Star employees or contractors.</p>
        <p><strong>Double Exposure hook:</strong> the memory of ordinary people quietly remade into someone else's puppets is exactly the note to leave hanging. When Project Hope's camps start "saving" the destitute and something behind the smiles is feeding on them, your players will feel the echo. (See the "Filling Double Exposure's Gaps" journal.)</p>`)
    ]
  },
  {
    name: "UtI — Legwork: The Futuremen", folder: "influence", sort: 80,
    pages: [
      page("Legwork (Any Gang / Street Contact, TN 4)", `
        <p><strong>0 successes:</strong> "Future Man? Ain't he that drunkie player who disappeared back in '54?"</p>
        <p><strong>1:</strong> "Yeah, I've heard of the Futuremen — hasn't everybody? They get splashed all over the six-o'clock news, but we'll see how tough they are if they come onto our turf."</p>
        <p><strong>2–3:</strong> "Those flaggers must have serious backing — packing more chrome than some runners I know. I dunno what they're up to, but I'm not about to cross 'em."</p>
        <p><strong>4+:</strong> "I know one of the guys in that gang — saw him on the trid when they hit that strip mall in Northgate. Asked him about it and he acted like he'd never heard of it. Swear it was him. Two days later he turns up dead. You ask me, something weird's goin' on with that gang."</p>`)
    ]
  }
];

for (const j of JOURNALS) {
  const w = journal(j);
  const safe = j.name.replace(/[^A-Za-z0-9]+/g, "_");
  writeFileSync(`${DIR}/${safe}_${w._id}.json`, JSON.stringify(w, null, 2) + "\n");
}
console.log(`wrote ${JOURNALS.length} journal(s) + ${Object.keys(FOLDERS).length} folders`);
