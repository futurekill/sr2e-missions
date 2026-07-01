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
  },

  // ── MALPRACTICE ────────────────────────────────────────────────────────────
  {
    name: "Mal 0 — Setup & Synopsis", folder: "malpractice", sort: 0,
    pages: [
      page("Premise", `
        <p>Seattle, 2057. <strong>Robert "Doctor Bob" Khamdeng</strong> — once a DocWagon paramedic, now a shadowrunner — was approached years ago by a shadowy figure called <strong>Brown</strong> who wanted DocWagon clients' <strong>DNA samples and medical histories</strong>. Bob refused; three days later his rookie HTR team was ambushed and wiped out, and only dumb luck spared him. He let the world think he'd died and vanished into the shadows.</p>
        <p>Now Bob has learned Brown had <em>another</em> DocWagon contact — a <strong>mole still working inside an HTR team</strong>. Through his old friend <strong>Liz Yamato</strong> (DocWagon Internal Security), he's traced it to <strong>Team Three</strong>, going on Expert Duty within a week. Bob hires the team to go undercover as DocWagon <strong>Temporary Response Personnel (TRP)</strong>, ride with Team Three, and unmask the mole.</p>`),
      page("The Cast of Villains (GM's choice)", `
        <p>The default mole is <strong>Shawn</strong>, a Team Three medic; the GM may pick a different one and adjust the clues. <strong>Brown</strong> and his organisation are deliberately open — a megacorp, a genetic-research player, the UCAS government, or "a secret cabal of mantis spirits" (Threats). His org plays to the mole's weaknesses (cash, power, BTLs, sex — all future blackmail leverage). Whatever you choose, Brown becomes a recurring <strong>Enemy</strong> in the PCs' lives (Enemy rules: <em>Shadowrun Companion</em> p.71–75).</p>
        <p><strong>DE tie-in:</strong> leaving "Brown's mysterious buyer of DNA and medical records" vague lets a GM later imply a Renraku or Universal Brotherhood fingerprint, threading Malpractice into Double Exposure's bio-experiment conspiracy.</p>`),
      page("Running It / Getting Started", `
        <p>Set in Seattle (relocatable to any DocWagon city; DocWagon lore in <em>NAGRL</em> p.41–47). Players may build DocWagon characters (<em>Shadowrun Companion</em> p.112) or run their usual shadowrunners and become temporary DocWagon medics over the adventure. If they're already DocWagon staff, <strong>Liz Yamato</strong> recruits them via the new TRP programme; if they're runners, <em>Train In Vain</em> is their crash course in not looking like a runner while wearing DocWagon colours.</p>`)
    ]
  },
  {
    name: "Mal 1 — Never Deal With the Wagon", folder: "malpractice", sort: 10,
    pages: [
      page("Read to the Players", `
        <p>"Mama, look! The boats!" A little boy caroms off your leg racing for the window overlooking <strong>Pier 60</strong>, then gapes up at you. His mother yanks him back, apologising, and hurries off. All around, suits stare furtively while pretending not to. At a big booth loaded with enough food for a family sits your man — "Morphine" — in a faded "Sonics in 53!" shirt: "Hoi! Glad you came. Sit, sit — no way I finish this alone. Wasn't sure what you'd like, so I ordered two of everything."</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> "Morphine" is <strong>Robert Khamdeng — "Doctor Bob"</strong>, an ex-DocWagon paramedic. He needs unknowns, not his own linked regulars. The job: undercover as DocWagon TRP for about a week; airtight cover IDs that only break if the team makes a mistake. Payment more than doubles his cash offer with non-monetary perks. Hard deadline: <strong>four weeks</strong>.</p>
        <p><strong>Behind the Scenes.</strong> Bob tells his story — Brown's old offer to buy DocWagon DNA/records, his refusal, the ambush that killed his team, his flight into the shadows — and the new job: a mole is <em>still</em> feeding Brown from inside an HTR team, and Bob wants them found. If the PCs already work for DocWagon, the request comes from <strong>Liz Yamato</strong> (Internal Security) as a "grave threat" assignment instead.</p>`),
      page("The Run & Opposition", `
        <p>No combat — a social meet. Bob won't be milked like a Johnson: <em>"My name is Khamdeng, not Johnson — I'm as poor as you are."</em> He's spent nearly everything on the cover IDs and training. A local trid station has offered him 20,000¥ for his story plus the mole's; from that he'll pay the team a <strong>15,000¥ bonus</strong> on success, and (grudgingly) throw in his third-row Supersonics season pass if a PC really pushes. Refusing to eat with him or hard-bargaining before he's finished may make him apologise and walk.</p>`),
      page("Dropping Clues & Debugging", `
        <p>If the team has no street contacts, a corporate contact calls instead; answer questions from the Doctor Bob / Robert Khamdeng entry in the Legwork section (book p.46). Veteran "never trust a Johnson" players may balk — a little courtesy keeps Bob at the table.</p>`)
    ]
  },
  {
    name: "Mal 2 — Train In Vain", folder: "malpractice", sort: 20,
    pages: [
      page("Read to the Players", `
        <p>The Redmond DocWagon clinic — too white, too clean, smelling of the sick and the dead. The <strong>Citymaster</strong> (264-10) is parked exactly where Bob said. A dwarf woman leans against its door; the street's quiet, the contact clean. As you cross, she looks up: "Any of you need a shot of <em>Morphine</em>?" — "Only to see the Sonics," you answer. "Get in," she says. "It's time to make you into spies."</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> A crash course in the DocWagon way. <strong>Liz Yamato</strong>'s job is to turn the team into an adequate Temporary Response crew in <em>48 hours</em> (vs the usual three weeks). She takes it seriously — one wrong move and she loses DocWagon's security, the chance at the mole, and probably her job.</p>
        <p><strong>Behind the Scenes.</strong> Liz lets them into the Citymaster and drives to an abandoned warehouse near the Federated Boeing shipyards for quick TRP training (run it out, use the optional encounters under <em>Sleepless In Seattle</em>, or hook them into a Virtual Training rig — GM's choice). If you skip the training, be sure the players learn the four rules below.</p>`),
      page("The DocWagon TRP Rules", `
        <p><strong>1. Protect the paramedics.</strong> If the medics can't work, clients die and DocWagon loses money. You are expendable; they are not.</p>
        <p><strong>2. Set up a perimeter</strong> around the doctors, using the Citymaster as the centre point.</p>
        <p><strong>3. At least one TRP accompanies each paramedic</strong> to the patient/client.</p>
        <p><strong>4. Rescuing non-clients is not a priority</strong> — but is allowed as long as it doesn't endanger the client or your teammates.</p>`)
    ]
  },
  {
    name: "Mal 3 — Spies Like Us", folder: "malpractice", sort: 30,
    pages: [
      page("Read to the Players", `
        <p>2113 hours. Liz drops you at the 83rd Street Clinic: "For the next two weeks you're Expert Team Three's Threat Response. Get me hard proof one of the four is the mole — until then my hands are tied. The mole's no use to me dead. Scan me?" You badge through to a garage of five ambulances, three Citymasters, a slung rotorcraft — a klaxon barks a crisis call and a loaded ambulance screams out. You reach Team Three's door and knock: a hotel-room-without-beds, trideo blaring. A red-haired woman beams, a balding man rises — "Seth Palatine. This is Vivianne Geldhausmann." "Call me Viv!" A young man in a silk kimono won't look up from the trid: Gordon Kurtz. "There's also Shawn — think he might be sleeping." A short man with a ponytail and three metallic jackports gleaming in his forehead pads in, waves, says nothing.</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> Awkward and disorienting: the runners are working <em>for</em> a megacorp, following its rules, while some of Team Three treat mere TRPs as a lower caste. Let that chafe — but the job is to protect the docs no matter what. They're TRPs for the full 14-day shift; the fake SINs pay two weeks either way, so they walk with something even if they never find the mole, and must stay in character even after they do.</p>
        <p><strong>Behind the Scenes.</strong> The team checks in and claims bunks (DocWagon EMT map, book p.36). Dispatch inspects each weapon and issues 10 gel or 10 stun rounds + clips plus 1 signed-for real round (returned unless used). Extra kit on request — medkits, grenades, more Narcoject, armor. Each vehicle carries 10 flash + 10 smoke grenades and 50 spare Narcoject rounds for rifles/pistols.</p>`),
      page("The Cast — Expert Team Three", `
        <p><strong>Seth Palatine</strong> — balding, devout, business-like leader; first responder scarred by the Night of Rage. <strong>Vivianne "Viv" Geldhausmann</strong> — red-haired team psychiatrist, relentlessly upbeat, widow of a murdered Lone Star informant. <strong>Gordon "Hawkeye" Kurtz</strong> — kimono-wearing wiseguy, secret physical adept and stimulant-fuelled embezzler. <strong>Shawn Ferrer</strong> — soft-spoken ponytailed dwarf rigger, forever yo-yoing, and the <em>default mole</em>. See the Cast compendium for full stat blocks; Legwork below for what contacts reveal about each.</p>`),
      page("Dropping Clues & Debugging", `
        <p>Little can go wrong: as long as the runners don't pick a fight, point fingers, or brag about DocWagon staff they've killed, Team Three accepts them at face value. If they threaten or draw on Liz, she humours them, defuses it, distances herself — and quietly stops trusting Bob's judgement, leaving the runners with no gear, no nuyen, no prospects.</p>`)
    ]
  },
  {
    name: "Mal 4 — Crash Course", folder: "malpractice", sort: 40,
    pages: [
      page("Read to the Players", `
        <p>"Expert Team Three! Report to ambulance 844-01! Crisis on Thomas and Fairview — <em>immediately!</em>" The klaxon startles you into motion; medics grab jackets and hats and charge for the garage. Shawn drives, Gordon rides shotgun as the Citymaster lurches out under siren. "Here's the situation, terps," Seth briefs you: "Client's a Miss Onizuka, 23, registered datajack and headware memory — caller reported severe head trauma, gunfire in the background." At the site — Thomas and Fairview, a T-intersection — small- and medium-caliber fire crackles; a chewed-up Leyland-Rover makes a barricade, two Patrol-Ones sit sideways across the street. "C'mon terp, get a move on! The longer we wait, the sooner she'll die!"</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> The runners' first real HTR run — and the first time they may feel they're betraying their own kind. A shadowrunning team (merc, rigger, two street sams, a decker) hit a Lone Star facility; the decker <strong>Onizuka</strong> was nearly killed by black IC and dump shock grabbing files that expose the local Star director's embezzling. Four corrupt officers — the only ones allowed to answer the call, no backup — have orders to shoot the runners "while resisting arrest."</p>
        <p><strong>Behind the Scenes.</strong> Lone Star officers: Threat/Pro 3/3, Partial Heavy Armor (6/4), HK227-S SMG + Ruger Thunderbolt; use Under the Influence's Foot Patrol Officer (book p.20) or SRII's Street Cop. Runners: SRII Mercenary/Rigger/Street Samurai + a Decker (VR2.0 p.79). Viv and Gordon fetch a stretcher; the officers hold fire the moment they see DocWagon colours approaching the runners.</p>`),
      page("The Run — Two Resolutions", `
        <p><strong>Option One — "I Fought the Law":</strong> an officer approaches, claims the decker escaped custody and is within his jurisdiction, then escalates from veiled legal threats to racial slurs and graphic insults — trying to bait the runners into the <em>first</em> violent move, which voids DocWagon's jurisdiction and lets the Star fire legally. A DocWagon Etiquette (3) Test (1 success) reminds a PC that the Star won't fire on DocWagon unless fired upon, and that proper procedure doesn't match what this officer is proposing.</p>
        <p><strong>Option Two — "Cross-Eyed &amp; Painless":</strong> the runners shadow the medics back to the Citymaster as mobile cover, ask to ride along with their fallen decker, and — if not flatly refused — try to <strong>carjack the Citymaster</strong>, taking a medic or the decker hostage to bluff the PCs into dropping weapons. They won't shoot hostages but will fire if threatened; they want the decker safe from DocWagon handing her to Lone Star.</p>`),
      page("Dropping Clues & Debugging", `
        <p>If the runners shoot first at the Star, they've overstepped DocWagon jurisdiction and the cops may fire with impunity (focusing the Citymaster and any PC aiding the runners); officers retreat if the decker seems dead or three take a Serious wound. Either way the PCs get reamed for risking a lawsuit and may blow their cover. DocWagon PCs, trained for exactly this, have the advantage — attacking in defiance of that training penalises them and the whole TRP team.</p>`)
    ]
  },
  {
    name: "Mal 5 — Chicken Soup", folder: "malpractice", sort: 50,
    pages: [
      page("Read to the Players", `
        <p>"Hey terps," Gordon says over the intercom, "delicate situation — I'll patch the client through." A woman's voice: "My name is Gloria Tanaka. I'm assistant to Peter Barnsworth — he has a DocWagon bracelet. We work for Parashield, Incorporated; we train and sell security paranimals. Mr. Barnsworth sold some trained <strong>cockatrii</strong> to a Renraku subsidiary… paperwork mix-up. Half an hour ago they got out of their cages — there was screaming and squawking, and now everyone's lying paralyzed on the floor. The cockatrii paralyze you when they escape. I climbed onto a crate — think I twisted my ankle. There's fifty of them loose in here, plus me and Mr. Barnsworth and the workers. They were sedated for shipment, but it's wearing off, and if they wake and see all these people down, they'll start eating them. Don't hurt them — Parashield puts 200,000 nuyen into each. Get here fast." Gunshots echo from the far end of the warehouse.</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> Utterly absurd at first — wading through a sea of groggy paranormal chickens to save people — then a race against time before the "Chickens of Doom" fully revive. <strong>Behind the Scenes.</strong> Yakuza operatives sabotaged the cages' master environment computer as a distraction to hit a nearby Mafia weapons shipment; now a yakuza vs Knight-Errant gun battle rages through the docks. Seth judges it too dangerous for the medics inside — the TRPs must carry the clients out to them. Of eight paralyzed victims, only <strong>Peter Barnsworth</strong> and the warehouse manager are DocWagon clients; the other six are workers.</p>`),
      page("The Run — Crying Fowl", `
        <p>The drugged cockatrii are docile, not asleep: they keep all standard powers but attack at <strong>+2 TN</strong>, with Quickness and Reaction halved (round down); a hit still does <strong>8M</strong> (SRII p.222/233). Their real enemy is <strong>noise</strong>. Any sound louder than casual conversation startles nearby birds; a single <strong>gunshot fully wakes 3D6</strong> cockatrii, who then ignore the sedative — for every shot fired, another 3D6 revive. Best rescue: the roof-mounted <strong>gripper crane</strong> (access ladder at the SE corner → 8×6-ft control platform; Perception (5) to work the controls) — one PC rides the crane while another positions it to lift clients out. After the fifth rescue the cockatrii are fully awake and will shred anyone still on the floor. Gordon will make a daring crate-hop rescue (taking a Serious Stun wound) rather than lose the last victim.</p>`),
      page("Dropping Clues & Debugging", `
        <p>If the runners kill any cockatrii, Parashield sues DocWagon and the guilty PC is put on probation until the case resolves — a real drag on promotion. If they ignore Gloria's warning and start shooting, they trigger a stampede that endangers everyone on the floor and earns a brutal official chewing-out. Then proceed to <strong>Sleepless in Seattle</strong>.</p>`)
    ]
  },
  {
    name: "Mal 6 — Sleepless in Seattle", folder: "malpractice", sort: 60,
    pages: [
      page("Read to the Players", `
        <p>Days of non-stop work; you're wiped. Peeling off armor that reeks like a wet sasquatch, you ease onto your bunk — and the telecom chirps you awake. Liz's face, flustered: "Glad I caught you. Someone tampered with the security logs. I checked the DNA records — an unknown user accessed the files about three hours ago. I think the mole will make the drop soon. Be on the lookout for—" A klaxon drowns her out: "Expert Team Three! Report for duty!" "Dammit — keep your eyes open. Good luck!" You grab gear and run. En route, a faint <em>pop</em>, then Shawn: "Brace for impact!" The Citymaster shudders, veers right, grinds along concrete and slams to a stop. "Front right tire blew — swerved into a street light," Shawn says. "Radio's down; impact must've jarred the transmitter. There's a telecom booth ten meters off — be right back."</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> The real punchy, no-sleep life of a DocWagon EMT — and the runners' <em>best</em> chance to catch the mole in the act. Encourage paranoia; don't give the players room to breathe. <strong>Behind the Scenes.</strong> The mole's "window" to transfer the stolen DNA/medical data to Brown is nearly up, so he rigged the tire to blow near a public telecom and blew it the moment he spotted one — the crash is his excuse to "call dispatch." Slot any GM-built emergency here (see the optional-encounter list) or run one of the training scenarios; DocWagon PCs may have already met these in Train in Vain.</p>`),
      page("Optional Emergency Calls", `
        <p>The specific call is the GM's to build (these double as Train in Vain training runs): a Mr. Johnson stiffed his runners and is being hunted, his Platinum bracelet tripped; a plane/helicopter down in Elliot Bay (Osprey II airlift in bad weather); a yakuza/Mafia firefight with clients in the crossfire; a Crisis Response Team cleaning up an exploded tanker truck; a high-rise hostage who is a Platinum client (heart-attack life-sign spike); an apartment fire spreading out of control; a Brackhaven Investments board member hurt in a terrorist attack; a go-gang carjacking the Citymaster en route; an I-405 traffic altercation where a pregnant Basic-Service client goes into premature labor; pulling a Standard Response Team out of a firefight. (Don't stack them all into one over-the-top scene.)</p>`),
      page("The Run — Catching the Mole", `
        <p>The tire is the trap. <strong>Perception (8)</strong> shows the tread was hit by intense heat where it looks worst; <strong>Demolitions (5)</strong> reveals a tiny explosive charge; <strong>Electronics (7)</strong> shows the radio was intentionally sabotaged. A PC on the public telecom can run <strong>Computer (8)</strong> or <strong>Electronics (10)</strong> to read the user logs: the most recent user just transferred files to an LTG number. That's enough evidence to give Liz, who arrives with ISD muscle to take the mole for questioning — let the players roleplay the unmasking to the hilt. Alternatively the mole bolts in a DocWagon vehicle: run the ultimate Seattle high-speed chase.</p>`),
      page("Dropping Clues & Debugging", `
        <p><strong>The dead-man's switch:</strong> as a safeguard Brown had the mole queue a "dead mail" — an e-mail reading only <em>"Cleopatra,"</em> set to reach Brown at midnight unless the mole delays it every 24 hours. Capture the mole and the mail fires, warning Brown his contact is blown → Brown panics (go to <strong>Déjà Vu</strong>). If the PCs accuse the <em>wrong</em> person, the ISD goons haul the innocent away, the real mole realises he's made and slips off to warn Brown — who picks him up, kills him, and dumps the body in Puget Sound (also → Déjà Vu). If the players just lounge in the Citymaster and miss the transfer, give them a second shot back at the clinic (a Liz call: "we need the mole's identity <em>now</em>").</p>`)
    ]
  },
  {
    name: "Mal 7 — Déjà Vu", folder: "malpractice", sort: 70,
    pages: [
      page("Read to the Players", `
        <p>The call came three minutes ago: an elf boy, <strong>Salthili Truan</strong>, reported injured in the rich Spring Lakes neighborhood of Renton — low blood pressure, irregular heartbeat, probably fell at the new Spring Lakes Apartments construction site. One person short, it feels like an easy one: just a hurt kid. The twelve-foot gates stand wide open; skeletal building frameworks pierce the night, stacks of I-beams and eight-foot pipe scattered across the yard, a drainage ditch spanned by a dirt bridge. A small crumpled form lies at the base of the nearest building. As the Citymaster crosses the bridge, sensors pick up the boy's beacon — then a <strong>bright light</strong> floods the cab from the second floor; a ball of light grows from a pinprick and detonates in front of you, jolting you wild in your restraints. A half-second later a second blast hits the ground to your right, and the world tips drunkenly sideways.</p>`),
      page("Hooks & Behind the Scenes", `
        <p><strong>Hooks.</strong> After two weeks of routine, this shatters the SOP. Something should recall Bob's ambush story and make the runners realise how much trouble they're in — they're fighting for their lives and the medics'. <strong>Behind the Scenes.</strong> This fires once the PCs accuse someone (right or wrong). Frantic to salvage his blown operation, <strong>Brown</strong> decides to slaughter Expert Team Three: he kidnapped the elf boy on his way home, dropped him bound and unconscious from the fourth floor to trigger the DocWagon call, and hacked the Response Team Allocation algorithm so Team Three catches any Spring Lakes call — re-staging the very ambush that "killed" Doctor Bob.</p>`),
      page("The Run — Opposition", `
        <p>Brown places two operatives with <strong>LAWs</strong> on the second story of the building by the gate and guides the rockets with his tactical computer (Shadowtech p.53) to detonate just in front of and right of the Citymaster — unless the driver makes a <strong>Car (16)</strong> Test, the blast flips it into the ditch. Then <strong>five operatives</strong> reveal (two in the big pipes, three behind steel girders that block heat/IR): FN-HARs or Ingram LMGs, camo jackets, explosive rounds — use Former Military Officer, Low-Grade (Contacts p.6) or SRII Mercenary. They pick off anyone leaving the Citymaster and shoot the gas tank; the LAW gunners take 5 turns to reach ground. Brown slips out the workman's entrance and drives to rendezvous with survivors. The medics try to revive the boy — reach him within <strong>7 turns</strong> or he dies.</p>
        <p><em>Tougher variant:</em> swap explosive rounds for APDS, or the LAWs for Ballista multi-role launchers (Fields of Fire p.42); resolve rockets with Brown's Gunnery + tactical-computer bonuses.</p>`),
      page("Dropping Clues & Debugging", `
        <p>Don't decimate the party, but Brown's mercs are trained and well-paid — they should get their pound of flesh. A captured operative, under <strong>Interrogation (8)</strong>, gives up the meet location and the two midnight-blue Superkombi vans Brown's men arrived in; enterprising PCs may tail Brown (any follow-up is the GM's to devise). If the runners blow cover instead of finishing the run as DocWagon staff, see Picking Up the Pieces for the consequences.</p>`)
    ]
  },
  {
    name: "Mal 8 — Picking Up the Pieces", folder: "malpractice", sort: 80,
    pages: [
      page("Wrap-Up", `
        <p>Expose the mole and the runners have succeeded. They meet Bob at <em>You Should Not Eat So Much!</em> to collect: he asks who they think is behind Brown, shares his own theory (whatever the GM wants known), maybe a hard-copy <em>Threats</em> Shadowland posting, and swears to go after the bad guys with everything he has — a springboard for future runs. <strong>Leaving the 83rd Street Clinic early</strong> (before the 14-day shift ends) breaks the contract: Bob pays only 5,000¥, and the alternate TRP team suffers Déjà Vu and is slaughtered. <strong>Killing the mole</strong> instead of turning him over means no exposure Karma, a possible murder charge, and — unless the "accident" is airtight — a trail back to the PCs. Never finding the mole: they finish the shift (ending days after Sleepless in Seattle), keep the fake SIN + gear + 3,400¥, skip the finale, but can try again in six weeks.</p>`),
      page("Awarding Karma", `
        <p>Team Karma (individual Karma per SRII p.199):</p>
        <ul>
          <li><strong>Survival</strong> — 1 point</li>
          <li><strong>Threat</strong> — 2 points</li>
          <li><strong>Mole is exposed</strong> — 1 point*</li>
          <li><strong>Mole is captured</strong> — 1 point</li>
          <li><strong>Injured non-clients saved</strong> — 1 point per 5 saved (as well as clients)</li>
          <li><strong>A paramedic dies through the runners' negligence</strong> — −1 point each</li>
        </ul>
        <p><em>*Ignore the "mole exposed" award if the runners kill the mole on discovering his identity.</em></p>`),
      page("The Bigger Picture — Brown as Enemy", `
        <p>Several questions are left for the GM: how were Brown and his organisation using the DNA and medical records? Who is Brown, and whom does he represent — a megacorp, a genetic-research player, the UCAS government, "a secret cabal of mantis spirits" (Threats)? Might he even be doing good? Most groups finish without ever meeting him, having earned a well-armed, unknown, secretive <strong>Enemy</strong> — the very essence of one (Shadowrun Companion p.71–75). Malpractice is a clean on-ramp to running an Enemy in a campaign; the ambush may well drive the PCs to hunt down who Brown is and why his people guard their secret so fiercely.</p>`)
    ]
  },
  {
    name: "Mal — Legwork: Team Three & Brown", folder: "malpractice", sort: 90,
    pages: [
      page("How to Use", `
        <p>Each table below lists the contacts likely to know something, the target number to get it, and the successes needed for richer answers. Robert Khamdeng has two tables (as <em>Morphine</em> and as <em>Doctor Bob</em>); Gordon Kurtz has two (different info from different contact types). Summarised from the Missions Legwork section (book p.46–47).</p>`),
      page("Morphine / Doctor Bob", `
        <p><strong>Morphine</strong> — Street contacts, TN 7 (Shadowland TN 6): freelance shadowrunner with no permanent team; rumoured shaman who keeps his head low "like he's hiding from somebody"; used to work for a corp — not one of the Big Eight; at 5+ successes, his real first name is <em>Robert</em>.</p>
        <p><strong>Doctor Bob / Robert Khamdeng</strong> — Media/Corporate/Policlub/Paramedic contacts, TN 8 (Shadowland TN 10): the DocWagon paramedic all over the news ~a decade back, won a humanitarian award; at 4+, was seen at a couple of Humanis Policlub meetings during the 2049 recruitment drive — "maybe just curious, or needed something to turn to." Not a Brackhaven or Vogel voter.</p>`),
      page("Seth Palatine & Viv Geldhausmann", `
        <p><strong>Seth Palatine</strong> — Paramedic/Corporate contacts, TN 5: keeps to himself, reads the Koran, nobody more dedicated to the job; at 3+, one of the first on scene during the <em>Night of Rage</em> — Metroplex Guardsmen kept him from the dying metahumans; at 4+, the Sons of Sauron bombed the apartment building his sick mother lived in, and the shock finished her.</p>
        <p><strong>Vivianne Geldhausmann</strong> — Paramedic/Corporate contacts, TN 6: the nicest person, relentless optimist; at 2+, her husband <em>Jacob</em> was killed four or five years ago in the big gang war with the Ancients; at 3+, Jacob was a Lone Star "Cybersnoop" — "that's the only time I've ever seen her sad."</p>`),
      page("Gordon Kurtz & Shawn Ferrer", `
        <p><strong>Gordon Kurtz</strong> — Paramedic/Corporate contacts, TN 5: rumoured rogue army colonel; loudmouthed wisecracker who's turned mean lately, never seems to sleep; at 4+, "maybe he learned some deep dark secret when he worked for <em>Crashcart</em>."</p>
        <p><strong>"Hawkeye" (Gordon Kurtz)</strong> — Street/Fixer contacts, TN 6: a big supplier of "things of a chemical nature," top-notch stuff, probably sourced from a corp; edgy for the past three months.</p>
        <p><strong>Shawn Ferrer</strong> — Paramedic/Corporate/CAS-Military contacts, TN 5: novahot programmer, Rice grad, works for Ares; quiet and private; maybe worked for the Azzies; spent time in the CAS military, "came well recommended, never tells war stories"; at 4+, "his bio lists him as a <em>dwarf</em> — ain't that weird?" (a data-entry tell of a fabricated identity).</p>`),
      page("Mr. Brown (Earl Brown)", `
        <p><strong>"Mr. Brown"</strong> — Policlub or UCAS-Military contacts, TN 9 (Shadowland TN 10, 48-hour search): a "Mr. Brown" was a small-time hood shot robbing a bank ("might as well be Mr. Drek") — a decoy identity; at 2+, "just what are you mixed up with, chummer?"; at 3+, the real Brown got a <em>dishonorable discharge</em> from the UCAS Army last decade, scuttlebutt says for brutality; at 4+, he was an unofficial liaison to <em>General Trahn</em> during the Compensation Army business last year, under an alias.</p>`)
    ]
  }
];

for (const j of JOURNALS) {
  const w = journal(j);
  const safe = j.name.replace(/[^A-Za-z0-9]+/g, "_");
  writeFileSync(`${DIR}/${safe}_${w._id}.json`, JSON.stringify(w, null, 2) + "\n");
}
console.log(`wrote ${JOURNALS.length} journal(s) + ${Object.keys(FOLDERS).length} folders`);
