// ═══════════════════════════════════════════════════════════════
//  🌸 DREAM GARDEN v2.0 — Deep Progression System
//  Cozy idle + puzzle + adventure game for Telegram Web App
//  Style: Glassmorphism + Pastel (PRESERVED 100%)
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  //  CONFIGURATION
  // ═══════════════════════════════════════════════════════════════
  const CONFIG = {
    SAVE_KEY: 'dreamGarden_save_v2',
    AUTO_SAVE_INTERVAL: 30000,      // 30 seconds
    EVENT_CHECK_INTERVAL: 15000,    // 15 seconds
    PUZZLE_COOLDOWN: 60000,         // 60 seconds
    PUZZLE_CHANCE: 0.08,            // 8% per check
    OFFLINE_CAP_HOURS: 8,
    MAX_LEVEL: 30,
    XP_BASE: 100,
    XP_EXPONENT: 1.4,
    UI_UPDATE_FPS: 10,
    EVENT_DURATION_MIN: 10,         // seconds
    EVENT_DURATION_MAX: 20,         // seconds
  };

  // ═══════════════════════════════════════════════════════════════
  //  FLOWER DATABASE
  // ═══════════════════════════════════════════════════════════════
  const FLOWERS = {
    1:  { emoji: '🌱', name: 'Sprout',      rarity: 'common',    clickBonus: 1,  autoBonus: 0,  multiplier: 1 },
    2:  { emoji: '🌷', name: 'Tulip',       rarity: 'common',    clickBonus: 2,  autoBonus: 0,  multiplier: 1 },
    3:  { emoji: '🌻', name: 'Sunflower',   rarity: 'common',    clickBonus: 0,  autoBonus: 1,  multiplier: 1 },
    5:  { emoji: '🌹', name: 'Rose',        rarity: 'uncommon',  clickBonus: 5,  autoBonus: 0,  multiplier: 1 },
    7:  { emoji: '🌸', name: 'Cherry',      rarity: 'uncommon',  clickBonus: 0,  autoBonus: 3,  multiplier: 1 },
    10: { emoji: '🪷', name: 'Lotus',       rarity: 'rare',      clickBonus: 0,  autoBonus: 0,  multiplier: 2 },
    12: { emoji: '🌺', name: 'Hibiscus',    rarity: 'rare',      clickBonus: 0,  autoBonus: 10, multiplier: 1 },
    15: { emoji: '🌼', name: 'Daisy Chain', rarity: 'epic',      clickBonus: 0,  autoBonus: 0,  multiplier: 3, duration: 30 },
    18: { emoji: '🌙', name: 'Moonflower',  rarity: 'epic',      clickBonus: 0,  autoBonus: 0,  multiplier: 1.5, nightBonus: true },
    20: { emoji: '🌈', name: 'Prism Bloom', rarity: 'legendary', clickBonus: 0,  autoBonus: 0,  multiplier: 5 },
    25: { emoji: '⭐', name: 'Star Lily',   rarity: 'legendary', clickBonus: 0,  autoBonus: 0,  multiplier: 10, duration: 60 },
    30: { emoji: '💫', name: 'Dream Orchid',rarity: 'mythic',    clickBonus: 0,  autoBonus: 0,  multiplier: 1, prestige: true },
  };

  const GARDEN_STAGES = [
    '🌱', '🌿', '🪴', '🌷', '🌻', '🌹',
    '🌸', '🌺', '🌼', '🌙', '🌈', '⭐',
    '🌳', '🏵️', '🦋', '🌌', '✨', '💫'
  ];

  // ═══════════════════════════════════════════════════════════════
  //  BOOSTER DATABASE
  // ═══════════════════════════════════════════════════════════════
  const BOOSTERS = {
    rain:       { emoji: '🌧️', name: 'Rain',        multiplier: 2,  target: 'auto',  duration: 60,  unlockLevel: 5 },
    sunshine:   { emoji: '☀️', name: 'Sunshine',    multiplier: 3,  target: 'click', duration: 30,  unlockLevel: 8 },
    rainbow:    { emoji: '🌈', name: 'Rainbow',     multiplier: 2,  target: 'all',   duration: 45,  unlockLevel: 12 },
    fairyDust:  { emoji: '✨', name: 'Fairy Dust',  multiplier: 5,  target: 'autoClick', duration: 20, unlockLevel: 18 },
    starfall:   { emoji: '🌟', name: 'Starfall',    multiplier: 5,  target: 'all',   duration: 30,  unlockLevel: 25 },
  };

  // ═══════════════════════════════════════════════════════════════
  //  EVENT DATABASE
  // ═══════════════════════════════════════════════════════════════
  const RANDOM_EVENTS = [
    { id: 'butterfly',    emoji: '🦋', name: 'Butterfly Visit',   effect: 'click',  value: 1.10, duration: 30 },
    { id: 'beeSwarm',     emoji: '🐝', name: 'Bee Swarm',         effect: 'auto',   value: 1.20, duration: 45 },
    { id: 'gentleRain',   emoji: '🌧️', name: 'Gentle Rain',       effect: 'all',    value: 1.50, duration: 60 },
    { id: 'doubleRainbow',emoji: '🌈', name: 'Double Rainbow',    effect: 'all',    value: 2.00, duration: 30 },
    { id: 'moonlight',    emoji: '🌙', name: 'Moonlight',         effect: 'all',    value: 1.50, duration: 120 },
    { id: 'shootingStar', emoji: '💫', name: 'Shooting Star',     effect: 'instant',value: 100,  duration: 0 },
  ];

  const LEGENDARY_EVENTS = [
    { id: 'aurora',       emoji: '🌌', name: 'Aurora Bloom',      effect: 'all',    value: 10.0, duration: 120 },
    { id: 'unicorn',      emoji: '🦄', name: 'Unicorn Visit',     effect: 'reward', value: 1000, duration: 0, xpBonus: 500 },
    { id: 'meteorShower', emoji: '🌟', name: 'Meteor Shower',     effect: 'autoClick', value: 20, duration: 60 },
  ];

  // ═══════════════════════════════════════════════════════════════
  //  PUZZLE DATABASE
  // ═══════════════════════════════════════════════════════════════
  const PUZZLE_TYPES = {
    patternMatch: {
      id: 'patternMatch',
      name: 'Connect the Flowers',
      emoji: '🔗',
      unlockLevel: 1,
      description: 'Tap matching pairs!',
    },
    memoryGarden: {
      id: 'memoryGarden',
      name: 'Memory Garden',
      emoji: '🧠',
      unlockLevel: 5,
      description: 'Repeat the sequence!',
    },
    flowerPath: {
      id: 'flowerPath',
      name: 'Flower Path',
      emoji: '🛤️',
      unlockLevel: 10,
      description: 'Choose the right path!',
    },
    logicBloom: {
      id: 'logicBloom',
      name: 'Logic Bloom',
      emoji: '🧩',
      unlockLevel: 15,
      description: 'Solve the riddle!',
    },
  };

  // ═══════════════════════════════════════════════════════════════
  //  MISSION TEMPLATES
  // ═══════════════════════════════════════════════════════════════
  const MISSION_TEMPLATES = [
    { id: 'clicks',      text: 'Click {target} times',        target: [50, 100, 200],     rewardCoins: [100, 200, 400] },
    { id: 'puzzles',     text: 'Complete {target} puzzles',   target: [3, 5, 8],          rewardCoins: [200, 500, 800] },
    { id: 'growth',      text: 'Grow garden {target} stages', target: [20, 50, 100],      rewardCoins: [150, 400, 700] },
    { id: 'boosters',    text: 'Use {target} boosters',       target: [2, 3, 5],          rewardCoins: [100, 300, 500] },
    { id: 'levelUp',     text: 'Reach level {target}',        target: [3, 5, 8],          rewardCoins: [300, 500, 1000] },
    { id: 'coins',       text: 'Earn {target} coins',         target: [500, 1000, 2000],  rewardCoins: [200, 500, 1000] },
  ];

  // ═══════════════════════════════════════════════════════════════
  //  GAME STATE (Single Source of Truth)
  // ═══════════════════════════════════════════════════════════════
  let state = {
    coins: 0,
    xp: 0,
    level: 1,
    totalClicks: 0,
    totalGrowth: 0,
    totalCoinsEarned: 0,
    flowersUnlocked: [1],
    achievements: [],
    lastOnline: Date.now(),
    autoGrowthRate: 0,
    activeBoosts: [],
    activeEvents: [],
    streakDays: 0,
    lastLoginDate: null,
    dailyMissions: [],
    dailyMissionsCompleted: 0,
    puzzlesCompleted: 0,
    puzzleCooldownEnd: 0,
    puzzleActive: false,
    inventory: {
      boosters: {},
      rareItems: [],
    },
    settings: {
      sound: true,
      notifications: true,
    },
    stats: {
      highestLevel: 1,
      longestStreak: 0,
      totalPuzzles: 0,
      totalEvents: 0,
      playTimeMinutes: 0,
    },
    // Session-only (not saved)
    sessionStartTime: Date.now(),
    lastTick: Date.now(),
    lastUIUpdate: 0,
    autoClickInterval: null,
  };

  // ═══════════════════════════════════════════════════════════════
  //  UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

  function formatNumber(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return Math.floor(n).toString();
  }

  function getXPRequired(level) {
    return Math.floor(CONFIG.XP_BASE * Math.pow(level, CONFIG.XP_EXPONENT));
  }

  function getGardenEmoji(level) {
    const idx = Math.min(Math.floor((level - 1) / 2), GARDEN_STAGES.length - 1);
    return GARDEN_STAGES[idx];
  }

  function getCurrentFlower(level) {
    const levels = Object.keys(FLOWERS).map(Number).sort((a, b) => b - a);
    for (const l of levels) {
      if (level >= l) return FLOWERS[l];
    }
    return FLOWERS[1];
  }

  function getClickValue() {
    const flower = getCurrentFlower(state.level);
    let value = 1 + (state.level * 0.5) + flower.clickBonus;

    // Apply boosters
    state.activeBoosts.forEach(b => {
      if (b.target === 'click' || b.target === 'all') {
        value *= b.multiplier;
      }
    });

    // Apply events
    state.activeEvents.forEach(e => {
      if (e.effect === 'click' || e.effect === 'all') {
        value *= e.value;
      }
    });

    // Apply flower multiplier
    value *= flower.multiplier;

    return Math.max(1, value);
  }

  function getAutoGrowthRate() {
    const flower = getCurrentFlower(state.level);
    let rate = state.autoGrowthRate + flower.autoBonus + (state.level * 0.1);

    // Apply boosters
    state.activeBoosts.forEach(b => {
      if (b.target === 'auto' || b.target === 'all') {
        rate *= b.multiplier;
      }
    });

    // Apply events
    state.activeEvents.forEach(e => {
      if (e.effect === 'auto' || e.effect === 'all') {
        rate *= e.value;
      }
    });

    return Math.max(0, rate);
  }

  // ═══════════════════════════════════════════════════════════════
  //  SAVE / LOAD SYSTEM
  // ═══════════════════════════════════════════════════════════════
  function saveGame() {
    const saveData = { ...state };
    delete saveData.sessionStartTime;
    delete saveData.lastTick;
    delete saveData.lastUIUpdate;
    delete saveData.autoClickInterval;
    delete saveData.puzzleActive;
    saveData.lastOnline = Date.now();
    localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(saveData));
  }

  function loadGame() {
    try {
      const saved = localStorage.getItem(CONFIG.SAVE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        // Merge saved data into state (preserve session-only fields)
        Object.keys(data).forEach(key => {
          if (state.hasOwnProperty(key)) {
            state[key] = data[key];
          }
        });
        processOfflineGains();
        checkDailyReset();
      }
    } catch (e) {
      console.warn('Save load failed, starting fresh');
    }
  }

  function processOfflineGains() {
    const now = Date.now();
    const offlineMs = now - state.lastOnline;
    const offlineHours = offlineMs / (1000 * 60 * 60);
    const cappedHours = Math.min(offlineHours, CONFIG.OFFLINE_CAP_HOURS);
    const offlineSeconds = cappedHours * 3600;

    if (offlineSeconds > 60 && state.autoGrowthRate > 0) {
      const rate = getAutoGrowthRate();
      const earned = Math.floor(rate * offlineSeconds * 0.5);
      if (earned > 0) {
        state.coins += earned;
        state.totalCoinsEarned += earned;
        showMessage(`🌙 While away: +${formatNumber(earned)} 🪙`);
      }
    }
  }

  function checkDailyReset() {
    const today = new Date().toDateString();
    if (state.lastLoginDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (state.lastLoginDate === yesterday) {
        state.streakDays++;
        if (state.streakDays > state.stats.longestStreak) {
          state.stats.longestStreak = state.streakDays;
        }
        showMessage(`🔥 Streak: ${state.streakDays} days!`);
        giveStreakReward();
      } else if (state.lastLoginDate !== null) {
        state.streakDays = 1;
        showMessage('🔥 New streak started!');
      } else {
        state.streakDays = 1;
      }
      state.lastLoginDate = today;
      generateDailyMissions();
      state.dailyMissionsCompleted = 0;
    }
  }

  function giveStreakReward() {
    const rewards = [
      { days: 1,  coins: 100,  item: null },
      { days: 2,  coins: 200,  item: null },
      { days: 3,  coins: 300,  item: 'rain' },
      { days: 5,  coins: 500,  item: 'sunshine' },
      { days: 7,  coins: 1000, item: 'rainbow' },
      { days: 14, coins: 2500, item: 'fairyDust' },
      { days: 30, coins: 10000, item: 'starfall' },
    ];
    const reward = rewards.reverse().find(r => state.streakDays >= r.days);
    if (reward) {
      state.coins += reward.coins;
      state.totalCoinsEarned += reward.coins;
      if (reward.item) {
        addBoosterToInventory(reward.item, 1);
        showMessage(`🎁 Streak ${state.streakDays}d: +${formatNumber(reward.coins)}🪙 + ${BOOSTERS[reward.item].emoji}`);
      } else {
        showMessage(`🎁 Streak ${state.streakDays}d: +${formatNumber(reward.coins)}🪙`);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  LEVEL SYSTEM
  // ═══════════════════════════════════════════════════════════════
  function addXP(amount) {
    state.xp += amount;
    const required = getXPRequired(state.level);
    if (state.xp >= required && state.level < CONFIG.MAX_LEVEL) {
      levelUp();
    }
    updateUI();
  }

  function levelUp() {
    state.xp -= getXPRequired(state.level);
    state.level++;
    if (state.level > state.stats.highestLevel) {
      state.stats.highestLevel = state.level;
    }

    // Unlock flower
    if (FLOWERS[state.level]) {
      if (!state.flowersUnlocked.includes(state.level)) {
        state.flowersUnlocked.push(state.level);
      }
    }

    // Auto-growth unlock at L5
    if (state.level === 5) {
      state.autoGrowthRate = 1;
      showMessage('🌹 Auto-Growth unlocked!');
    }

    // Give level reward
    const reward = getLevelReward(state.level);
    state.coins += reward.coins;
    state.totalCoinsEarned += reward.coins;

    // Show epic notification for milestone levels
    if (state.level % 5 === 0) {
      showEpicLevelUp(state.level, reward);
      if (reward.booster) {
        addBoosterToInventory(reward.booster, 1);
      }
    } else {
      showMessage(`⭐ Level ${state.level}! +${formatNumber(reward.coins)}🪙`);
    }

    // Trigger puzzle on level up
    setTimeout(() => triggerPuzzle('levelup'), 1000);

    saveGame();
    updateUI();
  }

  function getLevelReward(level) {
    const isEpic = level % 5 === 0;
    const isRare = level % 3 === 0;
    return {
      coins: 50 * level,
      xp: 25 * level,
      rarity: isEpic ? 'epic' : (isRare ? 'rare' : 'common'),
      booster: isEpic ? getEpicBoosterForLevel(level) : null,
    };
  }

  function getEpicBoosterForLevel(level) {
    const map = { 5: 'rain', 10: 'sunshine', 15: 'rainbow', 20: 'fairyDust', 25: 'starfall', 30: 'starfall' };
    return map[level] || null;
  }

  // ═══════════════════════════════════════════════════════════════
  //  COIN & GROWTH SYSTEM
  // ═══════════════════════════════════════════════════════════════
  function addCoins(amount, source = 'click') {
    const val = Math.floor(amount);
    state.coins += val;
    state.totalCoinsEarned += val;
    state.totalGrowth += val;

    // Check mission progress
    checkMissionProgress('coins', val);

    // Floating text effect
    if (source === 'click') {
      createFloatingText(`+${formatNumber(val)}`, event);
    }
  }

  function handleGardenClick(e) {
    state.totalClicks++;
    const value = getClickValue();
    addCoins(value, 'click');

    // Visual feedback
    const garden = $('.garden');
    if (garden) {
      garden.style.transform = 'scale(0.92)';
      setTimeout(() => garden.style.transform = '', 100);
    }

    // Particles
    spawnParticles(e.clientX, e.clientY);

    // Check mission
    checkMissionProgress('clicks', 1);

    updateUI();
    saveGame();
  }

  // ═══════════════════════════════════════════════════════════════
  //  BOOSTER SYSTEM
  // ═══════════════════════════════════════════════════════════════
  function addBoosterToInventory(type, count) {
    state.inventory.boosters[type] = (state.inventory.boosters[type] || 0) + count;
    updateUI();
  }

  function useBooster(type) {
    const boosterDef = BOOSTERS[type];
    if (!boosterDef) return;
    if (state.level < boosterDef.unlockLevel) {
      showMessage('🔒 Unlock at level ' + boosterDef.unlockLevel);
      return;
    }
    if (!state.inventory.boosters[type] || state.inventory.boosters[type] <= 0) {
      showMessage('❌ No ' + boosterDef.emoji + ' left!');
      return;
    }

    state.inventory.boosters[type]--;

    const booster = {
      type: type,
      emoji: boosterDef.emoji,
      name: boosterDef.name,
      multiplier: boosterDef.multiplier,
      target: boosterDef.target,
      endTime: Date.now() + (boosterDef.duration * 1000),
    };

    state.activeBoosts.push(booster);

    // Auto-click booster special handling
    if (boosterDef.target === 'autoClick') {
      startAutoClick(boosterDef.multiplier);
    }

    showMessage(`${boosterDef.emoji} ${boosterDef.name} activated!`);
    checkMissionProgress('boosters', 1);
    updateUI();
    saveGame();
  }

  function startAutoClick(clicksPerSec) {
    if (state.autoClickInterval) clearInterval(state.autoClickInterval);
    state.autoClickInterval = setInterval(() => {
      const value = getClickValue();
      addCoins(value, 'auto');
      updateUI();
    }, 1000 / clicksPerSec);
  }

  function stopAutoClick() {
    if (state.autoClickInterval) {
      clearInterval(state.autoClickInterval);
      state.autoClickInterval = null;
    }
  }

  function updateBoosters() {
    const now = Date.now();
    const before = state.activeBoosts.length;
    state.activeBoosts = state.activeBoosts.filter(b => b.endTime > now);
    if (before > state.activeBoosts.length) {
      // A booster expired
      stopAutoClick();
      updateUI();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  EVENT SYSTEM
  // ═══════════════════════════════════════════════════════════════
  function checkRandomEvent() {
    if (Math.random() > 0.15) return; // 15% chance

    const now = Date.now();

    // Legendary event chance (L25+)
    if (state.level >= 25 && Math.random() < 0.01) {
      triggerLegendaryEvent();
      return;
    }

    const eventDef = RANDOM_EVENTS[randInt(0, RANDOM_EVENTS.length - 1)];
    const event = {
      ...eventDef,
      endTime: now + (eventDef.duration * 1000),
    };

    state.activeEvents.push(event);
    state.stats.totalEvents++;

    showEventToast(event);

    // Instant rewards
    if (event.effect === 'instant') {
      state.coins += event.value;
      state.totalCoinsEarned += event.value;
    }
    if (event.effect === 'reward') {
      state.coins += event.value;
      state.totalCoinsEarned += event.value;
      if (event.xpBonus) addXP(event.xpBonus);
    }

    saveGame();
    updateUI();
  }

  function triggerLegendaryEvent() {
    const eventDef = LEGENDARY_EVENTS[randInt(0, LEGENDARY_EVENTS.length - 1)];
    const event = {
      ...eventDef,
      endTime: Date.now() + (eventDef.duration * 1000),
    };
    state.activeEvents.push(event);
    state.stats.totalEvents++;
    showEventToast(event, true);
    showMessage(`👑 LEGENDARY: ${eventDef.name}!`);
    saveGame();
    updateUI();
  }

  function updateEvents() {
    const now = Date.now();
    const before = state.activeEvents.length;
    state.activeEvents = state.activeEvents.filter(e => e.endTime > now);
    if (before > state.activeEvents.length) {
      updateUI();
    }
  }

  function showEventToast(event, isLegendary = false) {
    const toast = document.createElement('div');
    toast.className = 'event-toast' + (isLegendary ? ' legendary' : '');
    toast.innerHTML = `${event.emoji} <span>${event.name}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ═══════════════════════════════════════════════════════════════
  //  PUZZLE SYSTEM
  // ═══════════════════════════════════════════════════════════════
  function canTriggerPuzzle() {
    return !state.puzzleActive && Date.now() > state.puzzleCooldownEnd;
  }

  function triggerPuzzle(source = 'random') {
    if (!canTriggerPuzzle()) return;

    // Pick available puzzle type based on level
    const available = Object.values(PUZZLE_TYPES).filter(p => state.level >= p.unlockLevel);
    if (available.length === 0) return;

    const puzzleType = available[randInt(0, available.length - 1)];
    state.puzzleActive = true;
    state.puzzleCooldownEnd = Date.now() + CONFIG.PUZZLE_COOLDOWN;

    switch (puzzleType.id) {
      case 'patternMatch': startPatternMatch(); break;
      case 'memoryGarden': startMemoryGarden(); break;
      case 'flowerPath': startFlowerPath(); break;
      case 'logicBloom': startLogicBloom(); break;
    }

    saveGame();
  }

  // ── Pattern Match Puzzle ──
  function startPatternMatch() {
    const pairsCount = Math.min(3 + Math.floor(state.level / 5), 5);
    const flowers = ['🌷','🌻','🌹','🌸','🌺','🌼','🪷','🌱'];
    const selected = flowers.slice(0, pairsCount);
    const grid = [...selected, ...selected].sort(() => Math.random() - 0.5);

    let revealed = [];
    let matched = [];
    let moves = 0;
    const maxMoves = pairsCount * 3;

    const modal = createPuzzleModal('🔗 Connect the Flowers', 'Tap matching pairs!');
    const gridEl = document.createElement('div');
    gridEl.className = 'puzzle-grid';

    grid.forEach((emoji, idx) => {
      const cell = document.createElement('div');
      cell.className = 'puzzle-cell';
      cell.dataset.idx = idx;
      cell.dataset.emoji = emoji;
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
            cell.classList.add('matched');
            const other = gridEl.children[i2];
            other.classList.add('matched');
            revealed = [];

            if (matched.length === grid.length) {
              completePuzzle('patternMatch', { moves, maxMoves });
            }
          } else {
            setTimeout(() => {
              gridEl.children[i1].textContent = '❓';
              gridEl.children[i1].classList.remove('revealed');
              gridEl.children[i2].textContent = '❓';
              gridEl.children[i2].classList.remove('revealed');
              revealed = [];
            }, 600);
          }

          if (moves >= maxMoves && matched.length < grid.length) {
            setTimeout(() => {
              closePuzzleModal();
              showMessage('😔 Puzzle failed. Try again later!');
              state.puzzleActive = false;
            }, 500);
          }
        }
      };
      gridEl.appendChild(cell);
    });

    modal.content.appendChild(gridEl);
    document.body.appendChild(modal.el);
  }

  // ── Memory Garden Puzzle ──
  function startMemoryGarden() {
    const sequenceLength = Math.min(3 + Math.floor(state.level / 4), 6);
    const flowers = ['🌷','🌻','🌹','🌸','🌺','🌼'];
    const sequence = [];
    for (let i = 0; i < sequenceLength; i++) {
      sequence.push(flowers[randInt(0, flowers.length - 1)]);
    }

    const modal = createPuzzleModal('🧠 Memory Garden', 'Watch & repeat!');
    const display = document.createElement('div');
    display.className = 'memory-display';
    display.textContent = '👀';
    modal.content.appendChild(display);

    const inputRow = document.createElement('div');
    inputRow.className = 'memory-inputs';
    inputRow.style.display = 'none';
    flowers.forEach(f => {
      const btn = document.createElement('button');
      btn.className = 'memory-btn';
      btn.textContent = f;
      inputRow.appendChild(btn);
    });
    modal.content.appendChild(inputRow);

    let playerSequence = [];
    let showingSequence = true;

    // Show sequence
    let step = 0;
    const showInterval = setInterval(() => {
      if (step < sequence.length) {
        display.textContent = sequence[step];
        display.style.transform = 'scale(1.3)';
        setTimeout(() => display.style.transform = 'scale(1)', 300);
        step++;
      } else {
        clearInterval(showInterval);
        display.textContent = '❓ Your turn!';
        inputRow.style.display = 'flex';
        showingSequence = false;

        // Enable input
        inputRow.querySelectorAll('.memory-btn').forEach(btn => {
          btn.onclick = () => {
            if (showingSequence) return;
            const chosen = btn.textContent;
            playerSequence.push(chosen);

            // Visual feedback
            display.textContent = chosen;

            if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
              display.textContent = '❌ Wrong!';
              setTimeout(() => {
                closePuzzleModal();
                showMessage('😔 Wrong sequence!');
                state.puzzleActive = false;
              }, 800);
              return;
            }

            if (playerSequence.length === sequence.length) {
              completePuzzle('memoryGarden', { sequenceLength });
            }
          };
        });
      }
    }, 800);

    document.body.appendChild(modal.el);
  }

  // ── Flower Path Puzzle ──
  function startFlowerPath() {
    const modal = createPuzzleModal('🛤️ Flower Path', 'Choose the golden path!');

    const pathsContainer = document.createElement('div');
    pathsContainer.className = 'paths-container';

    const correctPath = randInt(0, 2);
    const pathEmojis = [['🌿','🌸','🌺'], ['🍂','🥀','🍁'], ['🌾','🌻','🏵️']];

    for (let i = 0; i < 3; i++) {
      const path = document.createElement('div');
      path.className = 'flower-path';
      path.innerHTML = pathEmojis[i].map(e => `<span>${e}</span>`).join('');
      path.onclick = () => {
        if (i === correctPath) {
          path.style.borderColor = '#7ad7ff';
          completePuzzle('flowerPath', { correct: true });
        } else {
          path.style.borderColor = '#ff8cc6';
          path.style.opacity = '0.5';
          showMessage('😔 Wrong path! Small reward...');
          const smallReward = 20 * state.level;
          state.coins += smallReward;
          setTimeout(() => {
            closePuzzleModal();
            state.puzzleActive = false;
          }, 800);
        }
      };
      pathsContainer.appendChild(path);
    }

    modal.content.appendChild(pathsContainer);
    document.body.appendChild(modal.el);
  }

  // ── Logic Bloom Puzzle ──
  function startLogicBloom() {
    const flowers = [
      { emoji: '🌹', name: 'Rose', color: 'red' },
      { emoji: '🌷', name: 'Tulip', color: 'pink' },
      { emoji: '🌻', name: 'Sunflower', color: 'yellow' },
      { emoji: '🌸', name: 'Cherry', color: 'white' },
    ];

    const correct = randInt(0, 3);
    const clues = generateClues(flowers, correct);

    const modal = createPuzzleModal('🧩 Logic Bloom', 'Find the thirsty flower!');

    const cluesEl = document.createElement('div');
    cluesEl.className = 'logic-clues';
    clues.forEach(clue => {
      const p = document.createElement('p');
      p.textContent = '💡 ' + clue;
      cluesEl.appendChild(p);
    });
    modal.content.appendChild(cluesEl);

    const options = document.createElement('div');
    options.className = 'logic-options';
    flowers.forEach((f, i) => {
      const btn = document.createElement('button');
      btn.className = 'logic-btn';
      btn.innerHTML = `${f.emoji} ${f.name}`;
      btn.onclick = () => {
        if (i === correct) {
          btn.style.background = 'linear-gradient(135deg, #7ad7ff, #a18cd1)';
          completePuzzle('logicBloom', { correct: true });
        } else {
          btn.style.background = 'linear-gradient(135deg, #ff8cc6, #ff6b9d)';
          btn.style.opacity = '0.5';
          showMessage('😔 Not this one!');
          setTimeout(() => {
            closePuzzleModal();
            state.puzzleActive = false;
          }, 800);
        }
      };
      options.appendChild(btn);
    });
    modal.content.appendChild(options);

    document.body.appendChild(modal.el);
  }

  function generateClues(flowers, correctIdx) {
    const clues = [];
    const correctFlower = flowers[correctIdx];

    // Clue 1: Color hint
    const colors = { red: 'red petals', pink: 'pink petals', yellow: 'golden petals', white: 'white petals' };
    clues.push(`It has ${colors[correctFlower.color]}.`);

    // Clue 2: Position hint
    const positions = ['first', 'second', 'third', 'last'];
    clues.push(`It is ${correctIdx === 0 ? 'not the last' : 'not the first'} flower.`);

    // Clue 3: Elimination
    const wrongFlower = flowers.find((f, i) => i !== correctIdx);
    clues.push(`It is not the ${wrongFlower.name}.`);

    return clues;
  }

  // ── Puzzle Helpers ──
  function createPuzzleModal(title, subtitle) {
    const overlay = document.createElement('div');
    overlay.className = 'puzzle-overlay';

    const modal = document.createElement('div');
    modal.className = 'puzzle-modal panel';

    const header = document.createElement('div');
    header.className = 'puzzle-header';
    header.innerHTML = `<h3>${title}</h3><p>${subtitle}</p>`;
    modal.appendChild(header);

    const content = document.createElement('div');
    content.className = 'puzzle-content';
    modal.appendChild(content);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closePuzzleModal();
        state.puzzleActive = false;
      }
    };

    return { el: overlay, content: content };
  }

  function closePuzzleModal() {
    const overlay = $('.puzzle-overlay');
    if (overlay) overlay.remove();
  }

  function completePuzzle(type, data) {
    state.puzzlesCompleted++;
    state.stats.totalPuzzles++;

    const baseReward = 20 * state.level;
    const xpReward = 10 * state.level;
    let coinReward = baseReward;

    if (type === 'memoryGarden') {
      coinReward = 5 * data.sequenceLength * state.level;
    } else if (type === 'logicBloom') {
      coinReward = 25 * state.level;
    }

    state.coins += coinReward;
    state.totalCoinsEarned += coinReward;
    addXP(xpReward);

    checkMissionProgress('puzzles', 1);

    // Show reward
    const modal = $('.puzzle-modal');
    if (modal) {
      modal.innerHTML = `
        <div class="puzzle-reward">
          <div class="reward-emoji">🎉</div>
          <h3>Puzzle Solved!</h3>
          <p>+${formatNumber(coinReward)} 🪙</p>
          <p>+${formatNumber(xpReward)} ✨ XP</p>
          <button class="big-button" onclick="this.closest('.puzzle-overlay').remove(); window.DreamGarden.puzzleActive = false;">Awesome!</button>
        </div>
      `;
    }

    saveGame();
    updateUI();
  }

  // ═══════════════════════════════════════════════════════════════
  //  DAILY MISSIONS
  // ═══════════════════════════════════════════════════════════════
  function generateDailyMissions() {
    state.dailyMissions = [];
    const shuffled = [...MISSION_TEMPLATES].sort(() => Math.random() - 0.5);

    for (let i = 0; i < 3; i++) {
      const template = shuffled[i];
      const tier = randInt(0, template.target.length - 1);
      state.dailyMissions.push({
        id: template.id + '_' + Date.now() + '_' + i,
        text: template.text.replace('{target}', template.target[tier]),
        target: template.target[tier],
        progress: 0,
        rewardCoins: template.rewardCoins[tier],
        completed: false,
      });
    }
  }

  function checkMissionProgress(type, amount) {
    state.dailyMissions.forEach(mission => {
      if (mission.completed) return;
      if (mission.id.startsWith(type)) {
        mission.progress += amount;
        if (mission.progress >= mission.target) {
          mission.completed = true;
          state.coins += mission.rewardCoins;
          state.totalCoinsEarned += mission.rewardCoins;
          state.dailyMissionsCompleted++;
          showMessage(`📋 Mission complete! +${formatNumber(mission.rewardCoins)}🪙`);
          saveGame();
        }
      }
    });
    updateUI();
  }

  // ═══════════════════════════════════════════════════════════════
  //  UI UPDATES
  // ═══════════════════════════════════════════════════════════════
  function updateUI() {
    const now = Date.now();

    // Throttle UI updates
    if (now - state.lastUIUpdate < (1000 / CONFIG.UI_UPDATE_FPS)) return;
    state.lastUIUpdate = now;

    // Coins
    const coinsEl = $('#coin-display');
    if (coinsEl) coinsEl.textContent = formatNumber(state.coins);

    // Level
    const levelEl = $('#level-display');
    if (levelEl) levelEl.textContent = state.level;

    // XP Bar
    const xpBar = $('#xp-bar-fill');
    const xpText = $('#xp-text');
    if (xpBar && xpText) {
      const required = getXPRequired(state.level);
      const pct = state.level >= CONFIG.MAX_LEVEL ? 100 : (state.xp / required * 100);
      xpBar.style.width = pct + '%';
      xpText.textContent = state.level >= CONFIG.MAX_LEVEL 
        ? 'MAX' 
        : `${formatNumber(state.xp)} / ${formatNumber(required)}`;
    }

    // Garden emoji
    const garden = $('.garden');
    if (garden) {
      garden.textContent = getGardenEmoji(state.level);
    }

    // Auto-growth rate
    const autoEl = $('#auto-display');
    if (autoEl) {
      const rate = getAutoGrowthRate();
      autoEl.textContent = rate > 0 ? `+${rate.toFixed(1)}/s` : '';
    }

    // Boosters bar
    updateBoostersBar();

    // Active events
    updateEventsBar();

    // Missions
    updateMissionsPanel();

    // Streak
    const streakEl = $('#streak-display');
    if (streakEl) {
      streakEl.textContent = state.streakDays > 1 ? `🔥 ${state.streakDays}` : '';
    }

    // Inventory
    updateInventoryPanel();

    // Stats
    const statsEl = $('#stats-display');
    if (statsEl) {
      statsEl.innerHTML = `
        <div>🖱️ ${formatNumber(state.totalClicks)} clicks</div>
        <div>🧩 ${state.stats.totalPuzzles} puzzles</div>
        <div>🌟 Level ${state.stats.highestLevel}</div>
      `;
    }
  }

  function updateBoostersBar() {
    const bar = $('#boosters-bar');
    if (!bar) return;

    const now = Date.now();
    const active = state.activeBoosts.filter(b => b.endTime > now);

    if (active.length === 0) {
      bar.innerHTML = '';
      return;
    }

    bar.innerHTML = active.map(b => {
      const remaining = Math.ceil((b.endTime - now) / 1000);
      return `<div class="booster-badge">${b.emoji} ${remaining}s</div>`;
    }).join('');
  }

  function updateEventsBar() {
    const bar = $('#events-bar');
    if (!bar) return;

    const now = Date.now();
    const active = state.activeEvents.filter(e => e.endTime > now);

    if (active.length === 0) {
      bar.innerHTML = '';
      return;
    }

    bar.innerHTML = active.map(e => {
      const remaining = Math.ceil((e.endTime - now) / 1000);
      return `<div class="event-badge">${e.emoji} ${remaining}s</div>`;
    }).join('');
  }

  function updateMissionsPanel() {
    const panel = $('#missions-list');
    if (!panel) return;

    if (state.dailyMissions.length === 0) {
      panel.innerHTML = '<li>No active missions</li>';
      return;
    }

    panel.innerHTML = state.dailyMissions.map(m => {
      const pct = Math.min(100, (m.progress / m.target * 100));
      return `
        <li class="mission-item ${m.completed ? 'completed' : ''}">
          <div class="mission-text">${m.text}</div>
          <div class="mission-progress">
            <div class="mission-bar" style="width:${pct}%"></div>
            <span>${formatNumber(m.progress)}/${formatNumber(m.target)}</span>
          </div>
          <div class="mission-reward">+${formatNumber(m.rewardCoins)}🪙</div>
        </li>
      `;
    }).join('');
  }

  function updateInventoryPanel() {
    const panel = $('#inventory-list');
    if (!panel) return;

    const items = [];
    Object.entries(state.inventory.boosters).forEach(([type, count]) => {
      if (count > 0) {
        const b = BOOSTERS[type];
        if (b && state.level >= b.unlockLevel) {
          items.push({ type, emoji: b.emoji, name: b.name, count });
        }
      }
    });

    if (items.length === 0) {
      panel.innerHTML = '<li>No items yet</li>';
      return;
    }

    panel.innerHTML = items.map(item => `
      <li class="inventory-item" data-type="${item.type}">
        <span>${item.emoji} ${item.name}</span>
        <span class="item-count">×${item.count}</span>
        <button class="use-btn" data-type="${item.type}">Use</button>
      </li>
    `).join('');

    // Attach handlers
    panel.querySelectorAll('.use-btn').forEach(btn => {
      btn.onclick = () => useBooster(btn.dataset.type);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  VISUAL EFFECTS
  // ═══════════════════════════════════════════════════════════════
  function createFloatingText(text, clickEvent) {
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.textContent = text;

    const x = clickEvent ? clickEvent.clientX : window.innerWidth / 2;
    const y = clickEvent ? clickEvent.clientY : window.innerHeight / 2;

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 1000);
  }

  function spawnParticles(x, y) {
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = ['✨','🌸','🌿','💫','🪙'][randInt(0, 4)];
      p.style.left = (x + rand(-30, 30)) + 'px';
      p.style.top = (y + rand(-30, 30)) + 'px';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  }

  function showMessage(text) {
    const msg = $('#message');
    if (!msg) return;
    msg.textContent = text;
    msg.classList.remove('hidden');

    clearTimeout(msg._timeout);
    msg._timeout = setTimeout(() => msg.classList.add('hidden'), 2500);
  }

  function showEpicLevelUp(level, reward) {
    const overlay = document.createElement('div');
    overlay.className = 'epic-overlay';
    overlay.innerHTML = `
      <div class="epic-modal">
        <div class="epic-emoji">🎁</div>
        <h2>EPIC LEVEL ${level}!</h2>
        <p class="epic-reward">+${formatNumber(reward.coins)} 🪙</p>
        ${reward.booster ? `<p class="epic-booster">${BOOSTERS[reward.booster].emoji} ${BOOSTERS[reward.booster].name} unlocked!</p>` : ''}
        <p class="epic-hint">${getLevelUnlockText(level)}</p>
        <button class="big-button" onclick="this.closest('.epic-overlay').remove()">Claim!</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  function getLevelUnlockText(level) {
    const texts = {
      5: 'Auto-Growth unlocked! Your garden grows while you sleep.',
      10: 'Memory Garden puzzle unlocked! Test your mind.',
      15: 'Flower Path puzzle unlocked! Choose wisely.',
      20: 'Legendary Events unlocked! Rare wonders await.',
      25: 'Star Lily blooms! Your garden shines.',
      30: 'Dream Orchid achieved! Prestige awaits...',
    };
    return texts[level] || 'New content unlocked!';
  }

  // ═══════════════════════════════════════════════════════════════
  //  GAME LOOP
  // ═══════════════════════════════════════════════════════════════
  let lastEventCheck = 0;
  let autoSaveTimer = 0;

  function gameLoop(timestamp) {
    const now = Date.now();
    const dt = (now - state.lastTick) / 1000;
    state.lastTick = now;

    // Auto-growth (idle income)
    const autoRate = getAutoGrowthRate();
    if (autoRate > 0) {
      const earned = autoRate * dt;
      state.coins += earned;
      state.totalCoinsEarned += earned;
      state.totalGrowth += earned;
    }

    // Update boosters & events
    updateBoosters();
    updateEvents();

    // Random event check
    if (now - lastEventCheck > CONFIG.EVENT_CHECK_INTERVAL) {
      checkRandomEvent();
      lastEventCheck = now;
    }

    // Random puzzle trigger
    if (canTriggerPuzzle() && Math.random() < CONFIG.PUZZLE_CHANCE) {
      triggerPuzzle('random');
    }

    // Auto-save
    autoSaveTimer += dt * 1000;
    if (autoSaveTimer >= CONFIG.AUTO_SAVE_INTERVAL) {
      saveGame();
      autoSaveTimer = 0;
    }

    // Update UI
    updateUI();

    requestAnimationFrame(gameLoop);
  }

  // ═══════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ═══════════════════════════════════════════════════════════════
  function init() {
    loadGame();

    // Bind garden click
    const garden = $('.garden');
    if (garden) {
      garden.style.cursor = 'pointer';
      garden.addEventListener('click', handleGardenClick);
    }

    // Bind puzzle button
    const puzzleBtn = $('#puzzle-btn');
    if (puzzleBtn) {
      puzzleBtn.addEventListener('click', () => triggerPuzzle('manual'));
    }

    // Bind boost shop
    const boostShop = $('#boost-shop');
    if (boostShop) {
      boostShop.addEventListener('click', () => {
        // Simple boost purchase
        if (state.coins >= 200) {
          state.coins -= 200;
          const types = Object.keys(BOOSTERS).filter(t => state.level >= BOOSTERS[t].unlockLevel);
          if (types.length > 0) {
            const type = types[randInt(0, types.length - 1)];
            addBoosterToInventory(type, 1);
            showMessage(`🛒 Bought ${BOOSTERS[type].emoji}!`);
            saveGame();
          }
        } else {
          showMessage('❌ Need 200🪙');
        }
      });
    }

    // Start loop
    state.lastTick = Date.now();
    requestAnimationFrame(gameLoop);

    // Welcome message
    if (state.totalClicks === 0) {
      showMessage('🌸 Welcome to Dream Garden! Tap to grow!');
    } else {
      showMessage(`🌸 Welcome back! Level ${state.level}`);
    }

    console.log('🌸 Dream Garden v2.0 initialized');
  }

  // Expose for inline handlers
  window.DreamGarden = { puzzleActive: state.puzzleActive };

  // Start when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
