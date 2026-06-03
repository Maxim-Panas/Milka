let flowers = 0;
let coins = 0;

let clickPower = 1;
let autoPower = 0;

const flowersEl = document.getElementById("flowers");
const coinsEl = document.getElementById("coins");
const messageEl = document.getElementById("message");

const growBtn = document.getElementById("growBtn");
const buyFlower = document.getElementById("buyFlower");
const buyAuto = document.getElementById("buyAuto");
const achievementsEl = document.getElementById("achievements");

// LOAD SAVE
function loadGame() {
  const save = JSON.parse(localStorage.getItem("dreamGarden"));
  if (save) {
    flowers = save.flowers || 0;
    coins = save.coins || 0;
    clickPower = save.clickPower || 1;
    autoPower = save.autoPower || 0;
  }
}

// SAVE GAME
function saveGame() {
  localStorage.setItem("dreamGarden", JSON.stringify({
    flowers,
    coins,
    clickPower,
    autoPower
  }));
}

// UPDATE UI
function updateUI() {
  flowersEl.textContent = flowers;
  coinsEl.textContent = coins;
}

// MESSAGE SYSTEM
function showMessage(text) {
  messageEl.textContent = text;
  messageEl.classList.remove("hidden");

  setTimeout(() => {
    messageEl.classList.add("hidden");
  }, 2000);
}

// CLICK ACTION
growBtn.addEventListener("click", () => {
  flowers += clickPower;
  coins += clickPower;

  updateUI();
  saveGame();

  if (Math.random() < 0.2) {
    showMessage("🌸 Гарний ріст!");
  }

  checkAchievements();
});

// BUY CLICK UPGRADE
buyFlower.addEventListener("click", () => {
  if (coins >= 10) {
    coins -= 10;
    clickPower += 1;

    showMessage("✨ Твій клік став сильнішим!");
    updateUI();
    saveGame();
  } else {
    showMessage("❌ Не вистачає монет");
  }
});

// BUY AUTO GENERATOR
buyAuto.addEventListener("click", () => {
  if (coins >= 50) {
    coins -= 50;
    autoPower += 1;

    showMessage("🌿 Сад росте сам!");
    updateUI();
    saveGame();
  } else {
    showMessage("❌ Не вистачає монет");
  }
});

// AUTO GROWTH LOOP
setInterval(() => {
  if (autoPower > 0) {
    flowers += autoPower;
    coins += autoPower;

    updateUI();
    saveGame();
    checkAchievements();
  }
}, 1000);

// ACHIEVEMENTS
function checkAchievements() {
  if (flowers >= 10) {
    unlockAchievement("🌱 Посади 10 квітів");
  }
  if (flowers >= 100) {
    unlockAchievement("🌸 Посади 100 квітів");
  }
  if (coins >= 500) {
    unlockAchievement("💰 Назбирай 500 монет");
  }
}

function unlockAchievement(text) {
  const items = achievementsEl.querySelectorAll("li");

  items.forEach(item => {
    if (item.textContent === text) {
      item.style.color = "#7ad7ff";
      item.style.fontWeight = "bold";
    }
  });
}

// INIT
loadGame();
updateUI();

showMessage("🌸 Ласкаво в Dream Garden");
