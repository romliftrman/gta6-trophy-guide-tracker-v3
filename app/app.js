// Leonida Platinum Log — GTA VI trophy tracker (offline, localStorage only).
// Trophy names/descriptions/grades come from app/data/trophies.json (official 55).
// Guides below are this app's own words, written from the official descriptions.
const KEY = 'gta6-trophy-v3';
const SOURCE_LINE = 'Source: official trophy description (PlayStation 5 list, 18 Nov 2026). Further reading: PowerPyx · PlayStationTrophies.org · PSNProfiles · TrueTrophies · Exophase.';

const KIND = {
  story: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 22, 23, 24, 26, 27],
  activities: [15, 16, 17, 18, 19, 20, 21, 28, 29, 32, 44, 46, 51],
  collectibles: [30, 31, 35, 42, 54, 55],
  combat: [33, 34, 36, 37, 38, 39, 40, 41, 43],
  money: [52, 53],
  world: [1, 14, 25, 45, 47, 48, 49, 50],
};
const KIND_LABEL = {
  story: 'Story mission', activities: 'Activity & skill', collectibles: 'Collectible & exploration',
  combat: 'Combat & heist', money: 'Money & world', world: 'Choice & oddity',
};
const kindOf = (id) => Object.keys(KIND).find((k) => KIND[k].includes(id)) ?? 'world';
// Flagged from the wording of the official description only — caution, not confirmed missables.
const MISSABLE = {
  33: 'Partner required — do it while your partner is available in the story; availability may be story-limited.',
  37: 'Airport access may change as the story advances — do it before the late story.',
  48: 'Tied to a one-time story choice — check the cited guides before a big decision.',
  49: 'A second-chance moment tied to one event — the window may pass if you move on.',
  50: 'A strange one-off event — it can pass unnoticed if you are not looking for it.',
};
const STORY = new Set(KIND.story);

const GUIDES = {
  1: 'Earn the other 54 trophies first — there is no shortcut to the platinum. Use the Roadmap tab as your order of work, clear the Missables tab before you finish the story, and this unlocks automatically when the last one pops.',
  2: 'Play the opening mission, Gone Fishing, and follow its objectives to the end. Story trophy, cannot be missed.',
  3: 'Finish Chapter 1 by playing the story missions in order. Story trophy, cannot be missed.',
  4: 'Finish Chapter 2. Keep playing the story; chapter trophies unlock as the plot advances.',
  5: 'Finish Chapter 3. Story trophy — just keep following the main missions.',
  6: 'Finish Chapter 4, the last chapter trophy before the finale.',
  7: 'Complete the final mission of the story. Finish every chapter first; the finale unlocks at the end of the plot. Gold — the story climax.',
  8: 'Complete the story mission Breakfast Run. Follow the mission marker when it appears in your mission list.',
  9: 'Complete the story mission The Cartel Heist. Heist missions usually need a little prep — do any setup objectives the game offers before the main job.',
  10: 'Complete the story mission Child\u2019s Play. Story trophy, cannot be missed.',
  11: 'Complete the story mission Headliners. Story trophy, cannot be missed.',
  12: 'Complete the VCIA Takedown story mission. VCIA is the Vice City airport — expect a vehicle and airport set-piece, so go in with full health and ammo.',
  13: 'Complete the story mission Operation Savage Glory. Story trophy, cannot be missed.',
  14: 'Reach 100% completion: every story mission, stranger strand, activity, collectible set and challenge the game counts. Use this tracker as your checklist and clear one category at a time; check the in-game stats page to see what is still missing. Gold.',
  15: 'Complete 250 stunts across Leonida. Stunts count across sessions, so fold them into normal driving — jumps, near-misses and airtime add up. Pick a fast, sturdy car and revisit stunt spots between missions.',
  16: 'Try every activity type once: races, shooting range, fishing, arcade, meditation, hunting and the rest. One try each is enough — you do not need to win, just sample everything.',
  17: 'Earn a gold medal in every Shooting Range challenge. Practise one weapon class at a time, learn the target pattern before going for gold, and retry — medals are per challenge, not one run.',
  18: 'Win a Top Fun Drone Race at every drone-race location. Learn each course once slowly, then race it for the win; drone races reward clean lines more than top speed.',
  19: 'Win 20 different races. Enter each race type at least once and keep a list of the ones you have won — variety counts, repeats do not.',
  20: 'Beat Cal in a fishing challenge. Fish the challenge spot, watch the line tension and reel in steady bursts; losing the fish means starting the challenge over.',
  21: 'Finish one arcade game. Find an arcade cabinet, play any game to its end — score does not matter, completion does.',
  22: 'Complete the final mission for Andy. Finish Andy\u2019s strand of missions in order; the finale appears once his earlier jobs are done.',
  23: 'Complete the final mission for Kenton. Work through Kenton\u2019s missions as they appear.',
  24: 'Complete the final mission for Billy. Clear Billy\u2019s mission strand to unlock his finale.',
  25: 'Complete 8 mission strands for strangers across Leonida. Strangers appear as markers on the map — talk to everyone with a marker and finish each strand, not just the first job.',
  26: 'Complete the final mission for Randy. Finish Randy\u2019s strand in order.',
  27: 'Complete the final mission for Tyrone. Finish Tyrone\u2019s strand in order.',
  28: 'Meditate at every spot across Leonida. Meditation spots are quiet scenic points — visit each one and use the meditate prompt; check the map for spots you have not visited.',
  29: 'Hunt a unique animal for Bret. Follow Bret\u2019s tip to the animal\u2019s area, track it quietly and take the shot cleanly — a unique animal may not respawn, so save before the hunt.',
  30: 'Complete 3 collectible card sets. Cards are hidden around Leonida; collect full sets, not singles. Use the tracker to note which sets are finished, and trade duplicates if the game allows it.',
  31: 'WAiNK it at 100 locations. WAiNK spots are spread across the whole state — the count is cumulative, so tag a few every time you pass through a new area.',
  32: 'Complete 50 challenges. Challenges cover driving, combat, exploration and activities — the counter is cumulative, so keep playing varied and the total climbs on its own.',
  33: 'With your partner, build a 4-star wanted level and then lose it together. Do it in open country where you can break line of sight, then stay hidden until the stars clear. Flagged missable: partner availability may be story-limited.',
  34: 'Rob 3 shops back-to-back with your partner without losing your wanted level. Plan a route with three close shops, keep the wanted level alive between robberies, and do not get arrested in between.',
  35: 'Discover 100 vehicles. Every new vehicle you enter counts — borrow, buy and steal widely, and check the vehicle list for gaps.',
  36: 'Take down 5 enemies in a single use of Combat Focus. Find a group of enemies, trigger Combat Focus, and chain the kills before the meter runs out — a busy shootout is the best place to try.',
  37: 'Make an unscheduled departure at VCIA — take a plane from the airport without a scheduled flight. Flagged missable: airport access may change as the story advances, so do it while the airport is open to you.',
  38: 'Get into a Rhino tank and use it — the description\u2019s joke is the hint. Military hardware usually means a base or a late mission, so take the chance when one appears.',
  39: 'Rob a jewelry store without being detected. Go in quiet: no alarms, no witnesses, no cameras spotting you. If you are seen, leave and retry — detection fails the attempt, not the trophy.',
  40: 'Rob 5 bank vaults and escape. Vault jobs are the big scores — plan the getaway first, then the robbery, and count each clean escape.',
  41: 'Rob an armored truck and escape. Ambush a truck on a quiet road, grab the cash and break line of sight before the wanted level climbs.',
  42: 'Explore all of Leonida. Visit every district and named area — the map fills in as you go, so use it to spot the blank corners you have never entered.',
  43: 'Rob an illegal operation belonging to each gang. Every gang has operations on the map — hit one per gang, and expect each gang\u2019s turf to fight back differently.',
  44: 'Enjoy a cocktail with a view on Ocean Beach. Head to a bar on Ocean Beach, order a cocktail and watch the view — a quiet moment trophy, not a mission.',
  45: 'Smash your way out of a vehicle showroom in classic style. Drive through the showroom glass and out the other side — pick a sturdy car and a straight line.',
  46: 'Follow through at the Kolt & Associates bowling alley. Go bowling at the named alley and finish a game — follow-through means completing the delivery, not just throwing once.',
  47: 'A partnership with mass appeal. This reads as a co-op or partner milestone — play with your partner and build the partnership up; check the cited guides for the exact trigger.',
  48: 'Choices made, for better or worse. Some story choice locks this in — there may be no way back after you choose, so check the cited guides before a big decision. Flagged missable: tied to a one-time choice.',
  49: 'Second time\u2019s the charm. Something in the game needs a second attempt — retry the moment or challenge that failed the first time. Flagged missable: the second-chance window may be tied to one event.',
  50: 'What the hell just happened? A strange one-off event — keep an eye out for odd encounters off the beaten path, especially at night or in remote spots. Flagged missable: a one-time event can pass unnoticed.',
  51: 'Bowl them over with a melee drive-by. From a moving vehicle, knock targets down with a melee attack — a slow drive past a crowded pavement with a melee weapon ready is the way to try it.',
  52: 'Earn $250,000 laundering Marked Bills through your contacts. Marked Bills come from robberies — launder them through your contacts in batches until the $250,000 total is reached; the count is cumulative.',
  53: 'Spend $100,000 across all shops. The total is cumulative across every shop — vehicles, clothes, weapons and food all count, so normal spending adds up.',
  54: 'Purchase all garage properties. Buy every garage on the market — save up, then work through the property list one by one.',
  55: 'Register 10 vehicles to the Scooter Bros app. Use the app to register vehicles you own or find — 10 registrations in total, across any vehicles.',
};

const PHASES = [
  { title: '1 · Play the story', text: 'Chapters 1–4, the named missions and the finale. Unmissable — just play.', ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { title: '2 · Finish the stranger strands', text: 'Andy, Kenton, Billy, Randy, Tyrone — plus 8 stranger strands in total.', ids: [22, 23, 24, 25, 26, 27] },
  { title: '3 · Activities & skills', text: 'Stunts, races, shooting range golds, fishing, arcade, meditation, hunting, bowling.', ids: [15, 16, 17, 18, 19, 20, 21, 28, 29, 32, 46, 51] },
  { title: '4 · Collectibles & exploration', text: 'Card sets, WAiNK spots, vehicles, the whole map, garages, Scooter Bros registrations.', ids: [30, 31, 35, 42, 54, 55] },
  { title: '5 · Combat, heists & robberies', text: 'Do the flagged ones here, while partners and the airport are still available.', ids: [33, 34, 36, 37, 38, 39, 40, 41, 43] },
  { title: '6 · Money & the quiet ones', text: 'Launder, spend, smash a showroom, have a cocktail — and make the story choice with the guides open.', ids: [44, 45, 47, 48, 49, 50, 52, 53] },
  { title: '7 · 100% & platinum', text: 'Sweep the in-game stats for the last few percent, then the platinum pops.', ids: [14, 1] },
];

// ---- state ----
const $ = (id) => document.getElementById(id);
let doc = null;
let earned = new Set();
let lastValid = null; // last valid saved state, for import fallback
try {
  const raw = JSON.parse(localStorage.getItem(KEY) ?? 'null');
  if (raw && Array.isArray(raw.earned)) {
    earned = new Set(raw.earned.filter((x) => Number.isInteger(x)));
    lastValid = { earned: [...earned], spoilers: raw.spoilers !== false };
  }
} catch { earned = new Set(); }
let spoilers = lastValid ? lastValid.spoilers : true;
let view = 'tracker';

function save() {
  const state = { app: 'leonida-platinum-log', version: 1, earned: [...earned].sort((a, b) => a - b), spoilers };
  localStorage.setItem(KEY, JSON.stringify(state));
  lastValid = state;
}
function syncHash() {
  const p = new URLSearchParams({
    view, grade: $('grade').value, kind: $('kind').value, status: $('status').value,
    q: $('q').value, spoilers: spoilers ? 'on' : 'off', earned: [...earned].sort((a, b) => a - b).join(','),
  });
  history.replaceState(null, '', `#${p.toString()}`);
}
function readHash() {
  const p = new URLSearchParams(location.hash.slice(1));
  if (p.get('view') && ['tracker', 'roadmap', 'missables', 'sources'].includes(p.get('view'))) view = p.get('view');
  for (const [key, id] of [['grade', 'grade'], ['kind', 'kind'], ['status', 'status'], ['q', 'q']]) {
    if (p.get(key) !== null) $(id).value = p.get(key);
  }
  if (p.get('spoilers') === 'off') spoilers = false;
  if (p.get('spoilers') === 'on') spoilers = true;
  if (p.get('earned')) {
    const ids = p.get('earned').split(',').map(Number).filter((n) => Number.isInteger(n));
    if (ids.length) earned = new Set(ids);
  }
}

// ---- rendering ----
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
function gradeCounts() {
  const c = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of doc.trophies) c[t.grade] = (c[t.grade] ?? 0) + 1;
  return c;
}
function renderAudit() {
  const c = gradeCounts();
  const items = [
    `${doc.trophies.length}/${doc.trophies.length} official trophies`,
    `${c.platinum} platinum · ${c.gold} gold · ${c.silver} silver · ${c.bronze} bronze`,
    `${Object.keys(GUIDES).length} original guides`,
    `${Object.keys(MISSABLE).length} missable flags`,
    '0 network requests — fully offline',
  ];
  $('audit').replaceChildren(...items.map((s) => el('span', '', s)));
}
function renderProgress() {
  const total = doc.trophies.length;
  $('progressFill').style.width = `${(earned.size / total) * 100}%`;
  $('progressText').textContent = `${earned.size} of ${total} earned — ${total - earned.size} to go`;
}
function card(t) {
  const isEarned = earned.has(t.id);
  const hidden = spoilers && STORY.has(t.id) && !isEarned;
  const cardEl = el('article', `card${isEarned ? ' earned' : ''}`);
  const top = el('div', 'card-top');
  top.append(el('h3', 't-name', hidden ? 'Story trophy — hidden' : t.name));
  top.append(el('span', `grade ${t.grade}`, t.grade));
  cardEl.append(top);
  if (hidden) {
    cardEl.append(el('p', 'spoiler-hidden', 'Spoiler shield is on: this story trophy stays hidden until you earn it. Untick “Hide story spoilers” to reveal it.'));
  } else {
    cardEl.append(el('p', 't-desc', t.description));
    const guide = el('p', 't-guide');
    guide.append(el('b', '', 'How: '));
    guide.append(document.createTextNode(GUIDES[t.id] ?? t.guide));
    cardEl.append(guide);
  }
  const meta = el('div', 't-meta');
  meta.append(el('span', 'tag', KIND_LABEL[kindOf(t.id)]));
  if (STORY.has(t.id)) meta.append(el('span', 'tag story', 'Story'));
  if (MISSABLE[t.id]) meta.append(el('span', 'tag missable', `⚠ Possibly missable — ${MISSABLE[t.id]}`));
  cardEl.append(meta);
  if (!hidden) cardEl.append(el('p', 't-source', SOURCE_LINE));
  const label = el('label', 'earn');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', `Mark ${t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    save();
    renderAll();
  });
  label.append(box, document.createTextNode(isEarned ? 'Earned ✓' : 'Mark as earned'));
  cardEl.append(label);
  return cardEl;
}
function renderTracker() {
  const q = $('q').value.trim().toLowerCase();
  const grade = $('grade').value;
  const kind = $('kind').value;
  const status = $('status').value;
  const list = doc.trophies.filter((t) => {
    if (grade !== 'all' && t.grade !== grade) return false;
    if (kind !== 'all' && kindOf(t.id) !== kind) return false;
    if (status === 'earned' && !earned.has(t.id)) return false;
    if (status === 'todo' && earned.has(t.id)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (GUIDES[t.id] ?? '').toLowerCase().includes(q))) return false;
    return true;
  });
  $('cards').replaceChildren(...list.map(card));
  $('countLine').textContent = list.length === doc.trophies.length
    ? `Showing all ${list.length} trophies.`
    : `Showing ${list.length} of ${doc.trophies.length} trophies.`;
}
function renderRoadmap() {
  const byId = new Map(doc.trophies.map((t) => [t.id, t]));
  $('phases').replaceChildren(...PHASES.map((ph) => {
    const li = document.createElement('li');
    const done = ph.ids.filter((id) => earned.has(id)).length;
    li.append(el('h3', '', `${ph.title} — ${done}/${ph.ids.length} earned`));
    li.append(el('p', '', ph.text));
    const chips = el('div', 'chips');
    for (const id of ph.ids) {
      const t = byId.get(id);
      if (t) chips.append(el('span', `chip${earned.has(id) ? ' done' : ''}`, `${t.name} (${t.grade})`));
    }
    li.append(chips);
    return li;
  }));
}
function renderMissables() {
  const list = doc.trophies.filter((t) => MISSABLE[t.id]);
  $('missableCards').replaceChildren(...list.map(card));
}
function renderSources() {
  const c = gradeCounts();
  $('sourceCounts').replaceChildren(
    el('li', '', `Official list: ${doc.trophies.length} trophies — ${c.platinum} platinum, ${c.gold} gold, ${c.silver} silver, ${c.bronze} bronze.`),
    el('li', '', `Guides in this app: ${Object.keys(GUIDES).length}, all written in the app's own words.`),
    el('li', '', `Missable flags: ${Object.keys(MISSABLE).length}, each derived from the official description and marked as unconfirmed.`),
    el('li', '', `Network requests on first load: 0 (local files only).`),
  );
}
function showView(v) {
  view = v;
  for (const tab of document.querySelectorAll('.tab')) tab.classList.toggle('active', tab.dataset.view === v);
  for (const name of ['tracker', 'roadmap', 'missables', 'sources']) {
    $(`view-${name}`).hidden = name !== v;
  }
  syncHash();
}
function renderAll() {
  renderAudit();
  renderProgress();
  renderTracker();
  renderRoadmap();
  renderMissables();
  renderSources();
  syncHash();
}

// ---- export / import (validated; bad files fall back to the last valid state) ----
$('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: 'leonida-platinum-log', version: 1, exportedAt: new Date().toISOString(), earned: [...earned].sort((x, y) => x - y), spoilers }, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('import').addEventListener('change', async (e) => {
  const msg = $('importMsg');
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(ids)) throw new Error('no earned list');
    const valid = new Set(doc.trophies.map((t) => t.id));
    const clean = [...new Set(ids.filter((n) => Number.isInteger(n) && valid.has(n)))];
    const skipped = ids.length - clean.length;
    if (!clean.length && ids.length) throw new Error('no recognised trophy ids');
    earned = new Set(clean);
    if (typeof data === 'object' && data !== null && typeof data.spoilers === 'boolean') spoilers = data.spoilers;
    $('spoilers').checked = spoilers;
    save();
    renderAll();
    msg.classList.remove('err');
    msg.textContent = `Imported ${clean.length} earned trophies from ${file.name}` + (skipped ? ` (${skipped} unknown entries skipped).` : '.');
  } catch (err) {
    if (lastValid) { // fall back to the last valid saved value instead of wiping progress
      earned = new Set(lastValid.earned);
      spoilers = lastValid.spoilers;
      $('spoilers').checked = spoilers;
      save();
    }
    renderAll();
    msg.classList.add('err');
    msg.textContent = `Import failed (${err.message}) — kept your previous progress (${earned.size} earned).`;
  }
});
$('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned ticks? This cannot be undone.')) return;
  earned = new Set();
  save();
  renderAll();
});
for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => showView(tab.dataset.view));
}
for (const id of ['q', 'grade', 'kind', 'status']) {
  $(id).addEventListener('input', () => { renderTracker(); syncHash(); });
}
$('spoilers').addEventListener('change', (e) => { spoilers = e.target.checked; save(); renderAll(); });

// ---- init ----
doc = await (await fetch('data/trophies.json')).json();
readHash();
$('spoilers').checked = spoilers;
showView(view);
renderAll();
