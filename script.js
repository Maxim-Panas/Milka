
# Generate completely rewritten script.js with all fixes
# Key changes:
# 1. Flower emoji properly maps to level
# 2. Boost shop works regardless of level (you can BUY, just can't USE until unlocked)
# 3. Upgrade shop for click power, auto-growth, critical chance
# 4. Pattern match puzzle: 10 pairs = 20 cards on 4x5 grid
# 5. All Ukrainian text

script_v3 = r'''// ═══════════════════════════════════════════════════════════════
//  🌸 DREAM GARDEN v2.2 — Повна версія (Українська)
//  Виправлено: квіти за рівнем, магазин бустерів, апгрейди, пазли 10 пар
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  //  КОНФІГУРАЦІЯ
  // ═══════════════════════════════════════════════════════════════
  const CFG = {
    SAVE_KEY: 'dreamGarden_save_v2_2',
    AUTO_SAVE_INTERVAL: 15000,
    EVENT_CHECK_INTERVAL: 12000,
    PUZZLE_COOLDOWN: 30000,
    PUZZLE_CHANCE: 0.05,
    OFFLINE_CAP_HOURS: 8,
    MAX_LEVEL: 30,
    XP_BASE: 80,
    XP_EXPONENT: 1.35,
    UI_FPS: 8,
    CLICK_BASE: 1,
  };

  // ═══════════════════════════════════════════════════════════════
  //  БАЗА КВІТІВ — прив'язка до рівнів
  // ═══════════════════════════════════════════════════════════════
  const FLOWERS = {
    1:  { emoji: '🌱', name: 'Паросток',       rarity: 'common',    click: 1,  auto: 0.2, mult: 1 },
    2:  { emoji: '🌷', name: 'Тюльпан',        rarity: 'common',    click: 2,  auto: 0,   mult: 1 },
    3:  { emoji: '🌻', name: 'Соняшник',       rarity: 'common',    click: 0,  auto: 0.8, mult: 1 },
    4:  { emoji: '🌿', name: 'Папороть',       rarity: 'common',    click: 1,  auto: 0.5, mult: 1 },
    5:  { emoji: '🌹', name: 'Троянда',        rarity: 'uncommon',  click: 4,  auto: 0,   mult: 1 },
    6:  { emoji: '🪴', name: 'Горщик',          rarity: 'uncommon',  click: 2,  auto: 1,   mult: 1 },
    7:  { emoji: '🌸', name: 'Сакура',         rarity: 'uncommon',  click: 0,  auto: 1.5, mult: 1 },
    8:  { emoji: '🌺', name: 'Гібіскус',       rarity: 'rare',      click: 3,  auto: 0,   mult: 1 },
    9:  { emoji: '🌼', name: 'Ромашка',        rarity: 'rare',      click: 0,  auto: 2,   mult: 1 },
    10: { emoji: '🪷', name: 'Лотос',          rarity: 'rare',      click: 0,  auto: 0,   mult: 2 },
    11: { emoji: '🍀', name: 'Конюшина',       rarity: 'rare',      click: 5,  auto: 0,   mult: 1 },
    12: { emoji: '🏵️', name: 'Розетка',        rarity: 'epic',      click: 0,  auto: 3,   mult: 1 },
    13: { emoji: '🌵', name: 'Кактус',         rarity: 'epic',      click: 6,  auto: 0,   mult: 1 },
    14: { emoji: '🌾', name: 'Пшениця',        rarity: 'epic',      click: 0,  auto: 4,   mult: 1 },
    15: { emoji: '🌷', name: 'Півонія',        rarity: 'epic',      click: 0,  auto: 0,   mult: 3,  duration: 30 },
    16: { emoji: '🌙', name: 'Місячна квітка', rarity: 'legendary', click: 0,  auto: 0,   mult: 1.5, night: true },
    17: { emoji: '🌲', name: 'Ялинка',         rarity: 'legendary', click: 8,  auto: 0,   mult: 1 },
    18: { emoji: '🎋', name: 'Бамбук',         rarity: 'legendary', click: 0,  auto: 5,   mult: 1 },
    19: { emoji: '🍄', name: 'Грибочок',       rarity: 'legendary', click: 10, auto: 0,   mult: 1 },
    20: { emoji: '🌈', name: 'Призмовий цвіт', rarity: 'legendary', click: 0,  auto: 0,   mult: 5 },
    21: { emoji: '🦋', name: 'Метелик-квітка', rarity: 'mythic',    click: 0,  auto: 6,   mult: 1 },
    22: { emoji: '🌳', name: 'Дуб',            rarity: 'mythic',    click: 12, auto: 0,   mult: 1 },
    23: { emoji: '🍁', name: 'Клен',           rarity: 'mythic',    click: 0,  auto: 7,   mult: 1 },
    24: { emoji: '🌴', name: 'Пальма',         rarity: 'mythic',    click: 15, auto: 0,   mult: 1 },
    25: { emoji: '⭐', name: 'Зоряна лілія',   rarity: 'mythic',    click: 0,  auto: 0,   mult: 8,  duration: 45 },
    26: { emoji: '🌌', name: 'Галактика',      rarity: 'mythic',    click: 20, auto: 0,   mult: 1 },
    27: { emoji: '✨', name: 'Світлячок',      rarity: 'mythic',    click: 0,  auto: 10,  mult: 1 },
    28: { emoji: '🦚', name: 'Павич-квітка',   rarity: 'mythic',    click: 25, auto: 0,   mult: 1 },
    29: { emoji: '👑', name: 'Королівська',    rarity: 'mythic',    click: 0,  auto: 12,  mult: 1 },
    30: { emoji: '💫', name: 'Мрійлива орхідея', rarity: 'mythic',  click: 0,  auto: 0,   mult: 1,  prestige: true },
  };

  // ═══════════════════════════════════════════════════════════════
  //  БУСТЕРИ
  // ═══════════════════════════════════════════════════════════════
  const BOOSTERS = {
    rain:      { emoji: '🌧️', name: 'Дощ',           mult: 2,  target: 'auto',      dur: 60,  unlock: 5,  price: 200 },
    sunshine:  { emoji: '☀️', name: 'Сонце',         mult: 3,  target: 'click',     dur: 30,  unlock: 8,  price: 350 },
    rainbow:   { emoji: '🌈', name: 'Веселка',       mult: 2,  target: 'all',       dur: 45,  unlock: 12, price: 500 },
    fairyDust: { emoji: '✨', name: 'Феєричний пил',  mult: 5,  target: 'autoClick', dur: 20,  unlock: 18, price: 800 },
    starfall:  { emoji: '🌟', name: 'Зорепад',       mult: 5,  target: 'all',       dur: 30,  unlock: 25, price: 1500 },
  };

  // ═══════════════════════════════════════════════════════════════
  //  АПГРЕЙДИ (купуються за монети — постійний прогрес!)
  // ═══════════════════════════════════════════════════════════════
  const UPGRADES = {
    clickPower: {
      id: 'clickPower',
      name: 'Сила кліку',
      emoji: '👆',
      desc: 'Збільшує монети за клік',
      basePrice: 50,
      priceMult: 1.4,
      effect: 1,        // +1 монета за рівень
      maxLevel: 50,
    },
    autoGrowth: {
      id: 'autoGrowth',
      name: 'Авто-ріст',
      emoji: '🌿',
      desc: 'Монети в секунду без кліків',
      basePrice: 100,
      priceMult: 1.5,
      effect: 0.5,      // +0.5 монети/сек за рівень
      maxLevel: 50,
    },
    critical: {
      id: 'critical',
      name: 'Критичний удар',
      emoji: '💥',
      desc: 'Шанс подвоїти клік',
      basePrice: 300,
      priceMult: 1.6,
      effect: 2,        // +2% шанс за рівень
      maxLevel: 25,
    },
    xpBoost: {
      id: 'xpBoost',
      name: 'Досвід садівника',
      emoji: '📚',
      desc: 'Більше досвіду за все',
      basePrice: 500,
      priceMult: 1.7,
      effect: 5,        // +5% XP за рівень
      maxLevel: 20,
    },
  };

  // ═══════════════════════════════════════════════════════════════
  //  ПОДІЇ
  // ═══════════════════════════════════════════════════════════════
  const EVENTS = [
    { id: 'butterfly',  emoji: '🦋', name: 'Метелик',       effect: 'click',  val: 1.2,  dur: 30 },
    { id: 'bee',        emoji: '🐝', name: 'Бджоли',        effect: 'auto',   val: 1.3,  dur: 45 },
    { id: 'rain',       emoji: '🌧️', name: 'Легкий дощ',    effect: 'all',    val: 1.6,  dur: 60 },
    { id: 'rainbow',    emoji: '🌈', name: 'Подвійна веселка', effect: 'all', val: 2.2,  dur: 30 },
    { id: 'moon',       emoji: '🌙', name: 'Місячне сяйво', effect: 'all',    val: 1.6,  dur: 120 },
    { id: 'star',       emoji: '💫', name: 'Падаюча зірка', effect: 'instant',val: 100,  dur: 0 },
  ];

  const LEGENDARY_EVENTS = [
    { id: 'aurora',  emoji: '🌌', name: 'Полярне сяйво', effect: 'all',    val: 10, dur: 120 },
    { id: 'unicorn', emoji: '🦄', name: 'Єдиноріг',       effect: 'reward', val: 1000, dur: 0, xp: 500 },
    { id: 'meteor',  emoji: '🌟', name: 'Метеоритний дощ', effect: 'autoClick', val: 15, dur: 60 },
  ];

  // ═══════════════════════════════════════════════════════════════
  //  ПАЗЛИ
  // ═══════════════════════════════════════════════════════════════
  const PUZZLES = {
    pattern: { id: 'pattern', name: "З'єднай квіти", emoji: '🔗', unlock: 1, desc: 'Знайди 10 пар!' },
    memory:  { id: 'memory',  name: 'Сад пам\'яті',    emoji: '🧠', unlock: 5, desc: 'Повтори послідовність!' },
    path:    { id: 'path',    name: 'Квітковий шлях', emoji: '🛤️', unlock: 10, desc: 'Обери правильний шлях!' },
    logic:   { id: 'logic',   name: 'Логічний цвіт',  emoji: '🧩', unlock: 15, desc: "Розв'яжи загадку!" },
  };

  // ═══════════════════════════════════════════════════════════════
  //  СТАН ГРИ
  // ═══════════════════════════════════════════════════════════════
  let state = {
    coins: 0,
    xp: 0,
    level: 1,
    clicks: 0,
    growth: 0,
    earned: 0,
    unlocked: [1],
    lastOnline: Date.now(),
    autoRate: 0,
    boosts: [],
    events: [],
    streak: 0,
    lastLogin: null,
    missions: [],
    missionsDone: 0,
    puzzlesDone: 0,
    puzzleCD: 0,
    puzzleActive: false,
    inventory: { boosters: {} },
    upgrades: { clickPower: 0, autoGrowth: 0, critical: 0, xpBoost: 0 },
    stats: { maxLevel: 1, maxStreak: 0, puzzles: 0, events: 0, time: 0 },
    // session
    lastTick: Date.now(),
    lastUI: 0,
    autoClickTimer: null,
  };

  // ═══════════════════════════════════════════════════════════════
  //  УТИЛІТИ
  // ═══════════════════════════════════════════════════════════════
  function $(s) { return document.querySelector(s); }
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function fmt(n) {
    if (n >= 1e9) return (n/1e9).toFixed(1) + 'Млрд';
    if (n >= 1e6) return (n/1e6).toFixed(1) + 'Млн';
    if (n >= 1e3) return (n/1e3).toFixed(1) + 'тис';
    return Math.floor(n).toString();
  }
  function xpReq(lvl) { return Math.floor(CFG.XP_BASE * Math.pow(lvl, CFG.XP_EXPONENT)); }
  function currentFlower(lvl) {
    const keys = Object.keys(FLOWERS).map(Number).sort((a,b) => b - a);
    for (const k of keys) if (lvl >= k) return FLOWERS[k];
    return FLOWERS[1];
  }

  // ═══════════════════════════════════════════════════════════════
  //  ЗБЕРЕЖЕННЯ
  // ═══════════════════════════════════════════════════════════════
  function save() {
    const data = JSON.parse(JSON.stringify(state));
    delete data.lastTick; delete data.lastUI; delete data.autoClickTimer; delete data.puzzleActive;
    data.lastOnline = Date.now();
    try { localStorage.setItem(CFG.SAVE_KEY, JSON.stringify(data)); } catch(e) {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(CFG.SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      Object.keys(data).forEach(k => { if (state[k] !== undefined) state[k] = data[k]; });
      offlineGains();
      dailyReset();
    } catch(e) { console.warn('Помилка завантаження'); }
  }

  function offlineGains() {
    const now = Date.now();
    const hours = Math.min((now - state.lastOnline) / 3600000, CFG.OFFLINE_CAP_HOURS);
    if (hours < 0.05) return;
    const earned = Math.floor(getAuto() * hours * 3600 * 0.4);
    if (earned > 0) { state.coins += earned; state.earned += earned; msg(`🌙 Поки тебе не було: +${fmt(earned)} 🪙`); }
  }

  function dailyReset() {
    const today = new Date().toDateString();
    if (state.lastLogin === today) return;
    const yest = new Date(Date.now() - 86400000).toDateString();
    if (state.lastLogin === yest) {
      state.streak++;
      if (state.streak > state.stats.maxStreak) state.stats.maxStreak = state.streak;
      streakReward();
    } else if (state.lastLogin) {
      state.streak = 1; msg('🔥 Новий streak!');
    } else { state.streak = 1; }
    state.lastLogin = today;
    genMissions();
    state.missionsDone = 0;
  }

  function streakReward() {
    const rw = [
      {d:1, c:100}, {d:2, c:200}, {d:3, c:300, b:'rain'},
      {d:5, c:500, b:'sunshine'}, {d:7, c:1000, b:'rainbow'},
      {d:14, c:2500, b:'fairyDust'}, {d:30, c:10000, b:'starfall'}
    ].reverse().find(r => state.streak >= r.d);
    if (!rw) return;
    state.coins += rw.c; state.earned += rw.c;
    if (rw.b) addInv(rw.b, 1);
    msg(`🎁 Streak ${state.streak}д: +${fmt(rw.c)}🪙${rw.b ? ' + ' + BOOSTERS[rw.b].emoji : ''}`);
  }

  // ═══════════════════════════════════════════════════════════════
  //  ЕКОНОМІКА
  // ═══════════════════════════════════════════════════════════════
  function getClick() {
    const f = currentFlower(state.level);
    // База + рівень + квітка + апгрейд сили кліку
    let v = CFG.CLICK_BASE + (state.level * 0.3) + f.click + (state.upgrades.clickPower * UPGRADES.clickPower.effect);
    // Крит
    const critChance = state.upgrades.critical * UPGRADES.critical.effect;
    const isCrit = Math.random() * 100 < critChance;
    if (isCrit) v *= 2;
    // Бустери
    state.boosts.forEach(b => { if (b.target === 'click' || b.target === 'all') v *= b.mult; });
    // Події
    state.events.forEach(e => { if (e.effect === 'click' || e.effect === 'all') v *= e.val; });
    // Множник квітки
    v *= f.mult;
    return { value: Math.max(1, Math.floor(v)), isCrit };
  }

  function getAuto() {
    const f = currentFlower(state.level);
    // База авто + квітка + рівень + апгрейд авто-росту
    let r = state.autoRate + f.auto + (state.level * 0.06) + (state.upgrades.autoGrowth * UPGRADES.autoGrowth.effect);
    state.boosts.forEach(b => { if (b.target === 'auto' || b.target === 'all') r *= b.mult; });
    state.events.forEach(e => { if (e.effect === 'auto' || e.effect === 'all') r *= e.val; });
    return Math.max(0, r);
  }

  function getXPBonus() {
    return 1 + (state.upgrades.xpBoost * UPGRADES.xpBoost.effect / 100);
  }

  function addCoins(amt, src) {
    const v = Math.floor(amt);
    state.coins += v; state.earned += v; state.growth += v;
    missionProg('coins', v);
  }

  function addXP(amt) {
    state.xp += amt * getXPBonus();
    const req = xpReq(state.level);
    if (state.xp >= req && state.level < CFG.MAX_LEVEL) {
      state.xp -= req;
      levelUp();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  РІВНІ
  // ═══════════════════════════════════════════════════════════════
  function levelUp() {
    state.level++;
    if (state.level > state.stats.maxLevel) state.stats.maxLevel = state.level;
    if (FLOWERS[state.level] && !state.unlocked.includes(state.level)) state.unlocked.push(state.level);

    const rw = { coins: 40 * state.level, xp: 20 * state.level, epic: state.level % 5 === 0 };
    state.coins += rw.coins; state.earned += rw.coins;

    if (rw.epic) {
      const bMap = {5:'rain', 10:'sunshine', 15:'rainbow', 20:'fairyDust', 25:'starfall', 30:'starfall'};
      if (bMap[state.level]) addInv(bMap[state.level], 1);
      epicModal(state.level, rw);
    } else {
      msg(`⭐ Рівень ${state.level}! +${fmt(rw.coins)}🪙`);
    }

    setTimeout(() => tryPuzzle('levelup'), 1200);
    save(); updateUI();
  }

  function epicModal(lvl, rw) {
    const texts = {
      5: 'Дощовий бустер! Сад росте швидше.',
      10: 'Сонячний бустер! Кліки сильніші.',
      15: 'Веселковий бустер! Все примножується.',
      20: 'Феєричний пил! Авто-кліки активовано.',
      25: 'Зорепад! Максимальна сила.',
      30: 'Мрійлива орхідея! Ти досяг вершини!'
    };
    const bMap = {5:'rain', 10:'sunshine', 15:'rainbow', 20:'fairyDust', 25:'starfall', 30:'starfall'};
    const b = bMap[lvl] ? BOOSTERS[bMap[lvl]] : null;

    const el = document.createElement('div');
    el.className = 'epic-overlay';
    el.innerHTML = `
      <div class="epic-modal">
        <div class="epic-emoji">🎁</div>
        <h2>ЕПІЧНИЙ РІВЕНЬ ${lvl}!</h2>
        <p class="epic-reward">+${fmt(rw.coins)} 🪙</p>
        ${b ? `<p class="epic-booster">${b.emoji} ${b.name} отримано!</p>` : ''}
        <p class="epic-hint">${texts[lvl] || 'Новий вміст відкрито!'}</p>
        <button class="big-button" id="epic-close">Забрати!</button>
      </div>`;
    document.body.appendChild(el);
    $('#epic-close').onclick = () => el.remove();
  }

  // ═══════════════════════════════════════════════════════════════
  //  КЛІКИ
  // ═══════════════════════════════════════════════════════════════
  function onGardenClick(e) {
    state.clicks++;
    const result = getClick();
    addCoins(result.value, 'click');
    missionProg('clicks', 1);

    const g = $('.garden');
    if (g) { g.style.transform = 'scale(0.9)'; setTimeout(() => g.style.transform = '', 120); }

    spawnParticles(e);
    floatText((result.isCrit ? '💥 КРИТ! ' : '') + '+' + fmt(result.value), e);
    save(); updateUI();
  }

  function onGrowBtnClick(e) {
    state.clicks++;
    const result = getClick();
    addCoins(result.value, 'click');
    missionProg('clicks', 1);

    const btn = $('#grow-btn');
    if (btn) { btn.style.transform = 'scale(0.95)'; setTimeout(() => btn.style.transform = '', 120); }

    const fakeE = { clientX: window.innerWidth/2, clientY: window.innerHeight/2 };
    spawnParticles(fakeE);
    floatText((result.isCrit ? '💥 КРИТ! ' : '') + '+' + fmt(result.value), fakeE);
    save(); updateUI();
  }

  // ═══════════════════════════════════════════════════════════════
  //  ВІЗУАЛЬНІ ЕФЕКТИ
  // ═══════════════════════════════════════════════════════════════
  function floatText(text, e) {
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.textContent = text;
    const x = e && e.clientX ? e.clientX : window.innerWidth / 2;
    const y = e && e.clientY ? e.clientY : window.innerHeight / 2;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    if (text.includes('КРИТ')) el.style.color = '#ff6b35';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  function spawnParticles(e) {
    const x = e && e.clientX ? e.clientX : window.innerWidth / 2;
    const y = e && e.clientY ? e.clientY : window.innerHeight / 2;
    const emojis = ['✨','🌸','🌿','💫','🪙','🌷','⭐'];
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = emojis[randInt(0, emojis.length - 1)];
      const tx = rand(-50, 50), ty = rand(-60, -20);
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      p.style.setProperty('--tx', tx + 'px');
      p.style.setProperty('--ty', ty + 'px');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 700);
    }
  }

  function msg(text) {
    const el = $('#message');
    if (!el) return;
    el.textContent = text;
    el.classList.remove('hidden');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.add('hidden'), 3000);
  }

  function toast(eventDef, legendary) {
    const el = document.createElement('div');
    el.className = 'event-toast' + (legendary ? ' legendary' : '');
    el.innerHTML = `${eventDef.emoji} <span>${eventDef.name}</span>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3500);
  }

  // ═══════════════════════════════════════════════════════════════
  //  БУСТЕРИ
  // ═══════════════════════════════════════════════════════════════
  function addInv(type, n) {
    state.inventory.boosters[type] = (state.inventory.boosters[type] || 0) + n;
    updateUI();
  }

  function useBooster(type) {
    const def = BOOSTERS[type];
    if (!def) return;
    // ВИКОРИСТАННЯ: потрібен рівень
    if (state.level < def.unlock) { msg('🔒 Потрібен рівень ' + def.unlock + ' для використання'); return; }
    if (!state.inventory.boosters[type] || state.inventory.boosters[type] <= 0) { msg('❌ Немає ' + def.emoji); return; }

    state.inventory.boosters[type]--;
    state.boosts.push({ type, emoji: def.emoji, name: def.name, mult: def.mult, target: def.target, end: Date.now() + def.dur * 1000 });

    if (def.target === 'autoClick') startAutoClick(def.mult);
    msg(`${def.emoji} ${def.name} активовано!`);
    missionProg('boosters', 1);
    save(); updateUI();
  }

  function startAutoClick(cps) {
    if (state.autoClickTimer) clearInterval(state.autoClickTimer);
    state.autoClickTimer = setInterval(() => {
      const r = getClick();
      addCoins(r.value, 'auto');
      updateUI();
    }, 1000 / cps);
  }

  function stopAutoClick() {
    if (state.autoClickTimer) { clearInterval(state.autoClickTimer); state.autoClickTimer = null; }
  }

  function updateBoosts() {
    const now = Date.now();
    const before = state.boosts.length;
    state.boosts = state.boosts.filter(b => b.end > now);
    if (before > state.boosts.length) { stopAutoClick(); updateUI(); }
  }

  // ═══════════════════════════════════════════════════════════════
  //  АПГРЕЙДИ (купівля за монети)
  // ═══════════════════════════════════════════════════════════════
  function getUpgradePrice(id) {
    const u = UPGRADES[id];
    const lvl = state.upgrades[id] || 0;
    return Math.floor(u.basePrice * Math.pow(u.priceMult, lvl));
  }

  function buyUpgrade(id) {
    const u = UPGRADES[id];
    const currentLvl = state.upgrades[id] || 0;
    if (currentLvl >= u.maxLevel) { msg('🔒 Максимальний рівень!'); return; }
    const price = getUpgradePrice(id);
    if (state.coins < price) { msg(`❌ Потрібно ${fmt(price)}🪙`); return; }

    state.coins -= price;
    state.upgrades[id] = currentLvl + 1;
    msg(`${u.emoji} ${u.name} +1! (рівень ${state.upgrades[id]})`);
    save(); updateUI();
  }

  // ═══════════════════════════════════════════════════════════════
  //  ПОДІЇ
  // ═══════════════════════════════════════════════════════════════
  function checkEvent() {
    if (Math.random() > 0.12) return;
    if (state.level >= 25 && Math.random() < 0.008) { triggerLegendary(); return; }

    const def = EVENTS[randInt(0, EVENTS.length - 1)];
    const ev = { ...def, end: Date.now() + def.dur * 1000 };
    state.events.push(ev);
    state.stats.events++;
    toast(def);

    if (def.effect === 'instant') { state.coins += def.val; state.earned += def.val; }
    save(); updateUI();
  }

  function triggerLegendary() {
    const def = LEGENDARY_EVENTS[randInt(0, LEGENDARY_EVENTS.length - 1)];
    const ev = { ...def, end: Date.now() + def.dur * 1000 };
    state.events.push(ev);
    state.stats.events++;
    toast(def, true);
    msg(`👑 ЛЕГЕНДАРНО: ${def.name}!`);
    if (def.effect === 'reward') { state.coins += def.val; state.earned += def.val; if (def.xp) addXP(def.xp); }
    save(); updateUI();
  }

  function updateEvents() {
    const now = Date.now();
    const before = state.events.length;
    state.events = state.events.filter(e => e.end > now);
    if (before > state.events.length) updateUI();
  }

  // ═══════════════════════════════════════════════════════════════
  //  ПАЗЛИ — 10 пар (20 карток) на сітці 4×5
  // ═══════════════════════════════════════════════════════════════
  function canPuzzle() { return !state.puzzleActive && Date.now() > state.puzzleCD; }

  function tryPuzzle(src) {
    if (!canPuzzle()) return;
    const avail = Object.values(PUZZLES).filter(p => state.level >= p.unlock);
    if (avail.length === 0) return;
    const type = avail[randInt(0, avail.length - 1)];
    state.puzzleActive = true;
    state.puzzleCD = Date.now() + CFG.PUZZLE_COOLDOWN;

    switch (type.id) {
      case 'pattern': puzzlePattern(); break;
      case 'memory': puzzleMemory(); break;
      case 'path': puzzlePath(); break;
      case 'logic': puzzleLogic(); break;
    }
    save();
  }

  function puzzleOverlay(title, subtitle) {
    const ov = document.createElement('div');
    ov.className = 'puzzle-overlay';
    const md = document.createElement('div');
    md.className = 'puzzle-modal panel';
    md.innerHTML = `<div class="puzzle-header"><h3>${title}</h3><p>${subtitle}</p></div>`;
    const content = document.createElement('div');
    content.className = 'puzzle-content';
    md.appendChild(content);
    ov.appendChild(md);
    ov.onclick = (e) => { if (e.target === ov) { ov.remove(); state.puzzleActive = false; } };
    document.body.appendChild(ov);
    return { overlay: ov, content: content };
  }

  // ── Pattern Match — 10 пар, 20 карток, сітка 4×5 ──
  function puzzlePattern() {
    // 10 унікальних емодзі × 2 = 20 карток
    const allEmojis = ['🌷','🌻','🌹','🌸','🌺','🌼','🪷','🌱','🌿','🪴','🌵','🍀','🌾','🍄','🎋','🏵️','🌲','🌳','🌴','🦋','🦚','👑','💫','⭐','🌈','🌙','✨','🌌'];
    const pairsCount = 10; // 10 пар = 20 карток
    const shuffledEmojis = allEmojis.sort(() => Math.random() - 0.5);
    const selected = shuffledEmojis.slice(0, pairsCount);
    const grid = [...selected, ...selected].sort(() => Math.random() - 0.5);

    let revealed = [], matched = [], moves = 0;
    const maxMoves = pairsCount * 3; // 30 ходів

    const { content } = puzzleOverlay("🔗 З'єднай квіти", `Знайди ${pairsCount} пар! (4×5 сітка)`);
    const gridEl = document.createElement('div');
    gridEl.className = 'puzzle-grid-large'; // 4 колонки

    grid.forEach((emoji, idx) => {
      const cell = document.createElement('div');
      cell.className = 'puzzle-cell';
      cell.textContent = '❓';
      cell.onclick = () => {
        if (matched.includes(idx) || revealed.includes(idx)) return;
        cell.textContent = emoji;
        cell.classList.add('revealed');
        revealed.push(idx);

        if (revealed.length === 2) {
          moves++;
          const [i1, i2] = revealed;
          if (grid[i1] === grid[i2]) {
            matched.push(i1, i2);
            [i1, i2].forEach(i => gridEl.children[i].classList.add('matched'));
            revealed = [];
            if (matched.length === grid.length) {
              setTimeout(() => finishPuzzle('pattern', { moves, maxMoves, pairs: pairsCount }), 400);
            }
          } else {
            setTimeout(() => {
              [i1, i2].forEach(i => { gridEl.children[i].textContent = '❓'; gridEl.children[i].classList.remove('revealed'); });
              revealed = [];
            }, 700);
          }
          if (moves >= maxMoves && matched.length < grid.length) {
            setTimeout(() => { closePuzzle(); msg('😔 Час вийшов! Спробуй пізніше!'); state.puzzleActive = false; }, 700);
          }
        }
      };
      gridEl.appendChild(cell);
    });
    content.appendChild(gridEl);
  }

  // ── Memory ──
  function puzzleMemory() {
    const len = Math.min(4 + Math.floor(state.level / 3), 8);
    const flowers = ['🌷','🌻','🌹','🌸','🌺','🌼','🪷','🌱','🌿','🪴'];
    const seq = [];
    for (let i = 0; i < len; i++) seq.push(flowers[randInt(0, flowers.length - 1)]);

    const { content } = puzzleOverlay("🧠 Сад пам'яті", 'Дивись уважно та повтори!');
    const display = document.createElement('div');
    display.className = 'memory-display';
    display.textContent = '👀';
    content.appendChild(display);

    const inputRow = document.createElement('div');
    inputRow.className = 'memory-inputs';
    inputRow.style.display = 'none';
    flowers.slice(0, 6).forEach(f => {
      const btn = document.createElement('button');
      btn.className = 'memory-btn';
      btn.textContent = f;
      inputRow.appendChild(btn);
    });
    content.appendChild(inputRow);

    let player = [], showing = true;
    let step = 0;
    const interval = setInterval(() => {
      if (step < seq.length) {
        display.textContent = seq[step];
        display.style.transform = 'scale(1.3)';
        setTimeout(() => display.style.transform = 'scale(1)', 250);
        step++;
      } else {
        clearInterval(interval);
        display.textContent = "❓ Твоя черга!";
        inputRow.style.display = 'flex';
        showing = false;
        inputRow.querySelectorAll('.memory-btn').forEach(btn => {
          btn.onclick = () => {
            if (showing) return;
            const chosen = btn.textContent;
            player.push(chosen);
            display.textContent = chosen;
            if (player[player.length - 1] !== seq[player.length - 1]) {
              display.textContent = '❌ Неправильно!';
              setTimeout(() => { closePuzzle(); msg("😔 Неправильна послідовність!"); state.puzzleActive = false; }, 700);
              return;
            }
            if (player.length === seq.length) {
              setTimeout(() => finishPuzzle('memory', { len }), 400);
            }
          };
        });
      }
    }, 700);
  }

  // ── Path ──
  function puzzlePath() {
    const { content } = puzzleOverlay('🛤️ Квітковий шлях', 'Обери золотий шлях!');
    const correct = randInt(0, 2);
    const paths = [['🌿','🌸','🌺','🌷','🌻'], ['🍂','🥀','🍁','🌵','🌾'], ['🌾','🌻','🏵️','🌹','🌺']];
    const container = document.createElement('div');
    container.className = 'paths-container';

    for (let i = 0; i < 3; i++) {
      const path = document.createElement('div');
      path.className = 'flower-path';
      path.innerHTML = paths[i].map(e => `<span>${e}</span>`).join('');
      path.onclick = () => {
        if (i === correct) {
          path.style.borderColor = '#7ad7ff';
          finishPuzzle('path', { correct: true });
        } else {
          path.style.borderColor = '#ff8cc6';
          path.style.opacity = '0.5';
          const small = 20 * state.level;
          state.coins += small;
          msg(`😔 Неправильно... +${fmt(small)}🪙`);
          setTimeout(() => { closePuzzle(); state.puzzleActive = false; }, 700);
        }
      };
      container.appendChild(path);
    }
    content.appendChild(container);
  }

  // ── Logic ──
  function puzzleLogic() {
    const flowers = [
      { emoji: '🌹', name: 'Троянда', color: 'червоні' },
      { emoji: '🌷', name: 'Тюльпан', color: 'рожеві' },
      { emoji: '🌻', name: 'Соняшник', color: 'жовті' },
      { emoji: '🌸', name: 'Сакура', color: 'білі' },
    ];
    const correct = randInt(0, 3);
    const clues = genClues(flowers, correct);

    const { content } = puzzleOverlay('🧩 Логічний цвіт', 'Знайди квітку, якій потрібна вода!');
    const cluesEl = document.createElement('div');
    cluesEl.className = 'logic-clues';
    clues.forEach(c => { const p = document.createElement('p'); p.textContent = '💡 ' + c; cluesEl.appendChild(p); });
    content.appendChild(cluesEl);

    const opts = document.createElement('div');
    opts.className = 'logic-options';
    flowers.forEach((f, i) => {
      const btn = document.createElement('button');
      btn.className = 'logic-btn';
      btn.innerHTML = `${f.emoji} ${f.name}`;
      btn.onclick = () => {
        if (i === correct) {
          btn.style.background = 'linear-gradient(135deg, #7ad7ff, #a18cd1)';
          finishPuzzle('logic', { correct: true });
        } else {
          btn.style.background = 'linear-gradient(135deg, #ff8cc6, #ff6b9d)';
          btn.style.opacity = '0.5';
          msg('😔 Не ця квітка...');
          setTimeout(() => { closePuzzle(); state.puzzleActive = false; }, 700);
        }
      };
      opts.appendChild(btn);
    });
    content.appendChild(opts);
  }

  function genClues(flowers, correct) {
    const c = flowers[correct];
    const wrong = flowers.find((f, i) => i !== correct);
    return [
      `У неї ${c.color} пелюстки.`,
      `Це не ${wrong.name.toLowerCase()}.`,
      correct === 0 ? 'Вона перша у списку.' : 'Вона не перша у списку.'
    ];
  }

  function closePuzzle() {
    const ov = $('.puzzle-overlay');
    if (ov) ov.remove();
  }

  function finishPuzzle(type, data) {
    state.puzzlesDone++;
    state.stats.puzzles++;
    let coins = 25 * state.level;
    let xp = 15 * state.level;
    if (type === 'memory') { coins = 8 * data.len * state.level; }
    if (type === 'logic') { coins = 30 * state.level; xp = 25 * state.level; }
    if (type === 'pattern') { coins = 15 * data.pairs * state.level; }

    state.coins += coins; state.earned += coins;
    addXP(xp);
    missionProg('puzzles', 1);

    const ov = $('.puzzle-overlay');
    if (ov) {
      ov.querySelector('.puzzle-modal').innerHTML = `
        <div class="puzzle-reward">
          <div class="reward-emoji">🎉</div>
          <h3>Пазл вирішено!</h3>
          <p>+${fmt(coins)} 🪙</p>
          <p>+${fmt(xp)} ✨ досвіду</p>
          <button class="big-button" id="puzzle-ok">Круто!</button>
        </div>`;
      $('#puzzle-ok').onclick = () => { ov.remove(); state.puzzleActive = false; };
    }
    save(); updateUI();
  }

  // ═══════════════════════════════════════════════════════════════
  //  МІСІЇ
  // ═══════════════════════════════════════════════════════════════
  const MISSION_TEMPLATES = [
    { id: 'clicks',  text: 'Клікни {t} разів',      t: [30, 60, 100],    c: [80, 150, 250] },
    { id: 'puzzles', text: 'Виріши {t} пазлів',     t: [2, 4, 6],       c: [150, 350, 600] },
    { id: 'growth',  text: 'Накопичи {t} росту',    t: [100, 300, 500],  c: [100, 300, 500] },
    { id: 'boosters',text: 'Використай {t} бустерів', t: [1, 2, 3],      c: [80, 200, 400] },
    { id: 'levelUp', text: 'Досягни рівня {t}',     t: [3, 5, 8],       c: [200, 400, 800] },
    { id: 'coins',   text: 'Зароби {t} монет',      t: [300, 800, 1500], c: [150, 400, 700] },
  ];

  function genMissions() {
    state.missions = [];
    const shuffled = [...MISSION_TEMPLATES].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) {
      const t = shuffled[i];
      const tier = randInt(0, t.t.length - 1);
      state.missions.push({
        id: t.id + '_' + Date.now() + i,
        text: t.text.replace('{t}', t.t[tier]),
        target: t.t[tier],
        prog: 0,
        reward: t.c[tier],
        done: false,
      });
    }
  }

  function missionProg(type, amt) {
    state.missions.forEach(m => {
      if (m.done || !m.id.startsWith(type)) return;
      m.prog += amt;
      if (m.prog >= m.target) {
        m.done = true;
        state.coins += m.reward; state.earned += m.reward;
        state.missionsDone++;
        msg(`📋 Місія виконана! +${fmt(m.reward)}🪙`);
        save();
      }
    });
    updateUI();
  }

  // ═══════════════════════════════════════════════════════════════
  //  UI ОНОВЛЕННЯ
  // ═══════════════════════════════════════════════════════════════
  function updateUI() {
    const now = Date.now();
    if (now - state.lastUI < (1000 / CFG.UI_FPS)) return;
    state.lastUI = now;

    const coinEl = $('#coin-display');
    if (coinEl) coinEl.textContent = fmt(state.coins) + ' 🪙';

    const lvlEl = $('#level-display');
    if (lvlEl) lvlEl.textContent = state.level;

    const xpBar = $('#xp-bar-fill');
    const xpText = $('#xp-text');
    if (xpBar && xpText) {
      const req = xpReq(state.level);
      const pct = state.level >= CFG.MAX_LEVEL ? 100 : Math.min(100, state.xp / req * 100);
      xpBar.style.width = pct + '%';
      xpText.textContent = state.level >= CFG.MAX_LEVEL ? 'МАКС' : `${fmt(state.xp)} / ${fmt(req)} досвіду`;
    }

    // 🌸 КВІТКА ЗА РІВНЕМ — оновлюється кожен рівень!
    const garden = $('.garden');
    if (garden) {
      const f = currentFlower(state.level);
      garden.textContent = f.emoji;
      // Додаємо назву квітки під емодзі
      const nameEl = $('#flower-name');
      if (nameEl) nameEl.textContent = f.name;
    }

    const autoEl = $('#auto-display');
    if (autoEl) {
      const r = getAuto();
      autoEl.textContent = r > 0 ? `+${r.toFixed(1)} 🪙/сек` : '';
    }

    updateBoostsBar();
    updateEventsBar();
    updateMissions();
    updateInventory();
    updateFlowers();
    updateAchievements();
    updateUpgrades(); // 🆕 Апгрейди!

    const streakEl = $('#streak-display');
    if (streakEl) streakEl.textContent = state.streak > 1 ? `🔥 ${state.streak}` : '';

    const statsEl = $('#stats-display');
    if (statsEl) {
      statsEl.innerHTML = `
        <div>🖱️ ${fmt(state.clicks)} кліків</div>
        <div>🧩 ${state.stats.puzzles} пазлів</div>
        <div>⭐ Макс рівень: ${state.stats.maxLevel}</div>
      `;
    }
  }

  function updateBoostsBar() {
    const bar = $('#boosters-bar');
    if (!bar) return;
    const now = Date.now();
    const active = state.boosts.filter(b => b.end > now);
    if (active.length === 0) { bar.innerHTML = ''; return; }
    bar.innerHTML = active.map(b => {
      const sec = Math.ceil((b.end - now) / 1000);
      return `<div class="booster-badge">${b.emoji} ${sec}с</div>`;
    }).join('');
  }

  function updateEventsBar() {
    const bar = $('#events-bar');
    if (!bar) return;
    const now = Date.now();
    const active = state.events.filter(e => e.end > now);
    if (active.length === 0) { bar.innerHTML = ''; return; }
    bar.innerHTML = active.map(e => {
      const sec = Math.ceil((e.end - now) / 1000);
      return `<div class="event-badge">${e.emoji} ${sec}с</div>`;
    }).join('');
  }

  function updateMissions() {
    const list = $('#missions-list');
    if (!list) return;
    if (!state.missions.length) { list.innerHTML = '<li>Немає активних місій</li>'; return; }
    list.innerHTML = state.missions.map(m => {
      const pct = Math.min(100, m.prog / m.target * 100);
      return `
        <li class="mission-item ${m.done ? 'completed' : ''}">
          <div class="mission-text">${m.text}</div>
          <div class="mission-progress">
            <div class="mission-bar" style="width:${pct}%"></div>
            <span>${fmt(m.prog)}/${fmt(m.target)}</span>
          </div>
          <div class="mission-reward">+${fmt(m.reward)}🪙</div>
        </li>
      `;
    }).join('');
  }

  function updateInventory() {
    const list = $('#inventory-list');
    if (!list) return;
    const items = [];
    Object.entries(state.inventory.boosters).forEach(([type, count]) => {
      if (count > 0) {
        const b = BOOSTERS[type];
        if (b) items.push({ type, emoji: b.emoji, name: b.name, count, unlock: b.unlock });
      }
    });
    if (!items.length) { list.innerHTML = '<li>Поки що порожньо</li>'; return; }
    list.innerHTML = items.map(it => `
      <li class="inventory-item">
        <span>${it.emoji} ${it.name} ${state.level < it.unlock ? '<small style="opacity:0.5">(рів.' + it.unlock + ')</small>' : ''}</span>
        <span class="item-count">×${it.count}</span>
        <button class="use-btn" data-boost="${it.type}" ${state.level < it.unlock ? 'disabled style="opacity:0.4"' : ''}>${state.level < it.unlock ? '🔒' : 'Використати'}</button>
      </li>
    `).join('');
    list.querySelectorAll('.use-btn:not([disabled])').forEach(btn => {
      btn.onclick = () => useBooster(btn.dataset.boost);
    });
  }

  function updateFlowers() {
    const list = $('#flower-list');
    if (!list) return;
    const allLevels = Object.keys(FLOWERS).map(Number).sort((a, b) => a - b);
    list.innerHTML = allLevels.map(lvl => {
      const f = FLOWERS[lvl];
      const unlocked = state.unlocked.includes(lvl);
      const current = state.level >= lvl;
      const rarityStars = f.rarity === 'common' ? '⭐' : f.rarity === 'uncommon' ? '⭐⭐' : f.rarity === 'rare' ? '⭐⭐⭐' : f.rarity === 'epic' ? '⭐⭐⭐⭐' : f.rarity === 'legendary' ? '⭐⭐⭐⭐⭐' : '👑';
      return `<li style="opacity:${unlocked ? 1 : 0.35}">
        ${unlocked ? f.emoji : '🔒'} ${f.name} 
        ${unlocked ? '<span style="font-size:11px;opacity:0.6">' + rarityStars + '</span>' : `<span style="font-size:11px;opacity:0.5">рівень ${lvl}</span>`}
      </li>`;
    }).join('');
  }

  function updateAchievements() {
    const list = $('#achievements-list');
    if (!list) return;
    const achs = [
      { text: '🌱 Перші кроки — 10 кліків', check: state.clicks >= 10 },
      { text: '🌿 Садівник — Рівень 5', check: state.level >= 5 },
      { text: '🌸 Цвітіння — Рівень 10', check: state.level >= 10 },
      { text: '⭐ Зоряний садівник — Рівень 20', check: state.level >= 20 },
      { text: '💫 Майстер мрій — Рівень 30', check: state.level >= 30 },
      { text: '🧩 Розумник — 10 пазлів', check: state.stats.puzzles >= 10 },
      { text: '🪙 Багатій — 10 000 монет', check: state.earned >= 10000 },
      { text: '🔥 Вірний — Streak 7 днів', check: state.stats.maxStreak >= 7 },
    ];
    list.innerHTML = achs.map(a => `<li style="opacity:${a.check ? 1 : 0.4};${a.check ? 'font-weight:600;' : ''}">${a.text} ${a.check ? '✅' : ''}</li>`).join('');
  }

  // 🆕 АПГРЕЙДИ — оновлення панелі
  function updateUpgrades() {
    const list = $('#upgrades-list');
    if (!list) return;
    list.innerHTML = Object.values(UPGRADES).map(u => {
      const lvl = state.upgrades[u.id] || 0;
      const price = getUpgradePrice(u.id);
      const canBuy = state.coins >= price && lvl < u.maxLevel;
      const effectText = u.id === 'clickPower' ? `+${u.effect}🪙/клік` : u.id === 'autoGrowth' ? `+${u.effect}🪙/сек` : u.id === 'critical' ? `+${u.effect}% шанс` : `+${u.effect}% досвіду`;
      return `
        <li class="upgrade-item">
          <div class="upgrade-info">
            <span class="upgrade-emoji">${u.emoji}</span>
            <div class="upgrade-details">
              <div class="upgrade-name">${u.name} <span style="font-size:12px;opacity:0.6">рів.${lvl}/${u.maxLevel}</span></div>
              <div class="upgrade-desc">${u.desc} (${effectText})</div>
            </div>
          </div>
          <button class="upgrade-btn ${canBuy ? '' : 'disabled'}" data-upgrade="${u.id}">
            ${lvl >= u.maxLevel ? '✅ Макс' : fmt(price) + ' 🪙'}
          </button>
        </li>
      `;
    }).join('');
    list.querySelectorAll('.upgrade-btn:not(.disabled)').forEach(btn => {
      btn.onclick = () => buyUpgrade(btn.dataset.upgrade);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  ІГРОВИЙ ЦИКЛ
  // ═══════════════════════════════════════════════════════════════
  let lastEventCheck = 0;
  let saveTimer = 0;

  function loop() {
    const now = Date.now();
    const dt = (now - state.lastTick) / 1000;
    state.lastTick = now;

    const auto = getAuto();
    if (auto > 0) {
      const earned = auto * dt;
      state.coins += earned; state.earned += earned; state.growth += earned;
    }

    updateBoosts();
    updateEvents();

    if (now - lastEventCheck > CFG.EVENT_CHECK_INTERVAL) {
      checkEvent();
      lastEventCheck = now;
    }

    if (canPuzzle() && Math.random() < CFG.PUZZLE_CHANCE) {
      tryPuzzle('random');
    }

    saveTimer += dt * 1000;
    if (saveTimer >= CFG.AUTO_SAVE_INTERVAL) { save(); saveTimer = 0; }

    updateUI();
    requestAnimationFrame(loop);
  }

  // ═══════════════════════════════════════════════════════════════
  //  ІНІЦІАЛІЗАЦІЯ
  // ═══════════════════════════════════════════════════════════════
  function init() {
    load();

    const garden = $('.garden');
    if (garden) {
      garden.style.cursor = 'pointer';
      garden.addEventListener('click', onGardenClick);
      garden.addEventListener('touchstart', (e) => { e.preventDefault(); onGardenClick(e.touches[0]); }, {passive: false});
    }

    const growBtn = $('#grow-btn');
    if (growBtn) {
      growBtn.addEventListener('click', onGrowBtnClick);
      growBtn.addEventListener('touchstart', (e) => { e.preventDefault(); onGrowBtnClick(e.touches[0]); }, {passive: false});
    }

    const puzzleBtn = $('#puzzle-btn');
    if (puzzleBtn) {
      puzzleBtn.addEventListener('click', () => {
        if (!canPuzzle()) {
          const sec = Math.ceil((state.puzzleCD - Date.now()) / 1000);
          msg(`⏳ Пазл через ${sec}с`);
          return;
        }
        tryPuzzle('manual');
      });
    }

    // 🛒 Магазин бустерів — КУПІВЛЯ без обмежень рівня!
    const shopBtn = $('#boost-shop');
    if (shopBtn) {
      shopBtn.addEventListener('click', () => {
        const types = Object.keys(BOOSTERS);
        const type = types[randInt(0, types.length - 1)];
        const price = BOOSTERS[type].price;
        if (state.coins < price) { msg(`❌ Потрібно ${fmt(price)}🪙`); return; }
        state.coins -= price;
        addInv(type, 1);
        msg(`🛒 Куплено ${BOOSTERS[type].emoji} ${BOOSTERS[type].name}!`);
        save(); updateUI();
      });
    }

    // Event delegation для інвентарю та апгрейдів
    const invList = $('#inventory-list');
    if (invList) {
      invList.addEventListener('click', (e) => {
        const btn = e.target.closest('.use-btn');
        if (btn && !btn.disabled) useBooster(btn.dataset.boost);
      });
    }

    const upgList = $('#upgrades-list');
    if (upgList) {
      upgList.addEventListener('click', (e) => {
        const btn = e.target.closest('.upgrade-btn');
        if (btn && !btn.classList.contains('disabled')) buyUpgrade(btn.dataset.upgrade);
      });
    }

    state.lastTick = Date.now();
    requestAnimationFrame(loop);

    if (state.clicks === 0) {
      msg('🌸 Вітаємо у Dream Garden! Тапай, заробляй, покращуй!');
    } else {
      msg(`🌸 З поверненням! Рівень ${state.level}`);
    }

    console.log('🌸 Dream Garden v2.2 запущено');
  }

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
'''

print(f"Script v2.2 length: {len(script_v3)} chars")
print("Generated with all fixes:")
print("- Flower emoji updates every level")
print("- Boost shop: can BUY any booster, USE only when level unlocked")
print("- Upgrade shop: 4 permanent upgrades bought with coins")
print("- Pattern puzzle: 10 pairs (20 cards) on 4x5 grid")
print("- All Ukrainian text")
