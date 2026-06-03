let flowers = 0;
let coins = 0;

let clickPower = 1;
let autoPower = 0;

let gardenLevel = 1;
let xp = 0;
let xpToNext = 50;

const flowersEl = document.getElementById("flowers");
const coinsEl = document.getElementById("coins");
const messageEl = document.getElementById("message");
const achievementsEl = document.getElementById("achievements");

const growBtn = document.getElementById("growBtn");
const buyFlower = document.getElementById("buyFlower");
const buyAuto = document.getElementById("buyAuto");

// SAVE / LOAD
function saveGame() {
  localStorage.setItem("dreamGarden", JSON.stringify({
    flowers,
    coins,
    clickPower,
    autoPower,
    gardenLevel,
    xp,
    xpToNext
  }));
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem("dreamGarden"));
  if (!data) return;

  flowers = data.flowers || 0;
  coins = data.coins || 0;
  clickPower = data.clickPower || 1;
  autoPower = data.autoPower || 0;
  gardenLevel = data.gardenLevel || 1;
  xp = data.xp || 0;
  xpToNext = data.xpToNext || 50;
}

// UI
function updateUI() {
  flowersEl.textContent = flowers;
  coinsEl.textContent = coins;
}

// MESSAGE
function showMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.remove("hidden");

  setTimeout(() => {
    messageEl.classList.add("hidden");
  }, 1800);
}

// XP SYSTEM
function addXP(amount) {
  xp += amount;

  if (xp >= xpToNext) {
    xp -= xpToNext;
    levelUp();
  }
}

function levelUp() {
  gardenLevel++;
  xpToNext = Math.floor(xpToNext * 1.4);

  clickPower++;
  autoPower++;

  showMessage(`🌿 Сад рівня ${gardenLevel}! Ріст прискорено!`);

  triggerEvent();
}

// MAIN CLICK
growBtn.addEventListener("click", () => {
  flowers += clickPower;
  coins += clickPower;

  addXP(5);

  updateUI();
  saveGame();

  if (Math.random() < 0.15) {
    showMessage("🌸 Квітка розквітла!");
  }
});

// SHOP
buyFlower.addEventListener("click", () => {
  if (coins >= 10) {
    coins -= 10;
    clickPower++;

    showMessage("✨ Сильніший дотик!");
    updateUI();
    saveGame();
  } else {
    showMessage("❌ Не вистачає монет");
  }
});

buyAuto.addEventListener("click", () => {
  if (coins >= 50) {
    coins -= 50;
    autoPower++;

    showMessage("🌿 Сад росте сам!");
    updateUI();
    saveGame();
  } else {
    showMessage("❌ Не вистачає монет");
  }
});

// AUTO GROWTH
setInterval(() => {
  if (autoPower > 0) {
    flowers += autoPower;
    coins += autoPower;

    addXP(2);

    updateUI();
    saveGame();
  }
}, 1000);

// 🌸 EVENTS (ГОЛОВНА ФІШКА ГРИ)
function triggerEvent() {
  const events = [
    "🌸 Раптовий цвіт! +50 монет",
    "🦋 Метелики множать квіти x2",
    "🌿 Дощ прискорив ріст",
    "✨ Фея залишила подарунок +100 монет",
    "🌙 Нічна магія: авто-рост +2 на 10 сек"
  ];

  const event = events[Math.floor(Math.random() * events.length)];

  showMessage(event);

  if (event.includes("+50")) coins += 50;
  if (event.includes("+100")) coins += 100;
  if (event.includes("x2")) flowers *= 2;
  if (event.includes("дощ")) clickPower += 1;
  if (event.includes("нічна")) {
    autoPower += 2;
    setTimeout(() => autoPower -= 2, 10000);
  }

  updateUI();
}

// 🌍 PASSIVE RANDOM EVENTS
setInterval(() => {
  if (Math.random() < 0.25) {
    triggerEvent();
  }
}, 15000);

// INIT
loadGame();
updateUI();
showMessage("🌸 Dream Garden ожив 🌿");
