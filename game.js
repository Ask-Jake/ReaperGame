// DOM elements
const story = document.getElementById("story");
const input = document.getElementById("input");
const options = document.getElementById("options");
const healthEl = document.getElementById("health");
const armorEl = document.getElementById("armor");
const enemyNameEl = document.getElementById("enemy-name");
const enemyHealthEl = document.getElementById("enemy-health");
const sceneImg = document.getElementById("scene-img");
const bossImg = document.getElementById("boss-img");
const bgMusic = document.getElementById("bg-music");
const introImg = document.getElementById("intro-img");
const skipBtn = document.getElementById("skip-button");

const nextSceneBtn = document.createElement("button");
nextSceneBtn.textContent = "Continue Adventure";
nextSceneBtn.style.display = "none";
nextSceneBtn.id = "continue-btn";
nextSceneBtn.style.marginTop = "10px";
nextSceneBtn.style.padding = "10px 20px";
nextSceneBtn.style.fontSize = "1.2em";
nextSceneBtn.onclick = () => nextScene();
options.appendChild(nextSceneBtn);

if (typeof window.curSceneIndex !== "number" || window.curSceneIndex < 0) {
  window.curSceneIndex = 0;
}

let player = {
  name: "",
  health: 100,
  maxHealth: 100,
  armor: 0,
  strength: 10,
  speed: 5,
  accuracy: 0.8,
  level: 1,
  xp: 0,
  gold: 0,
  weapon: { name: "Basic Scythe", bonus: 0, type: "weapon" },
  armorItem: { name: "Cloth Robe", bonus: 0, type: "armor" },
  inventory: [
    { name: "Iron Sword", bonus: 3, type: "weapon" },
    { name: "Steel Armor", bonus: 5, type: "armor" },
    { name: "Silver Dagger", bonus: 2, type: "weapon" },
    { name: "Knight Plate", bonus: 8, type: "armor" }
  ]
};

let enemy = null;
let currentTypeId = 0;

const scenes = [
  {
    name: "Temple",
    img: "temple.png",
    music: "temple.mp3",
    enemy: { name: "Demon Boss", health: 50, strength: 8, img: "Demonboss.png" },
    description: `SCENE 1 – TEMPLE:\nThe camera pans over a foreboding temple in the depths of Hell...`
  },
  {
    name: "Forest",
    img: "forest.png",
    music: "forest.mp3",
    enemy: { name: "Demon Supervisor", health: 80, strength: 12, img: "demonSupervisor.png" },
    description: `SCENE 2 – FOREST:\nThe camera traverses through a twisted forest...`
  },
  {
    name: "Metropolis",
    img: "city.png",
    music: "city.mp3",
    enemy: { name: "Demon CEO", health: 150, strength: 20, img: "demonCEO.png" },
    description: `FINAL SCENE 3 – METROPOLIS:\nA sprawling infernal metropolis stretches endlessly before you...`
  }
];

function typeText(text, delay = 30, callback) {
  currentTypeId++;
  const myId = currentTypeId;
  story.textContent = "";
  story.appendChild(skipBtn);
  skipBtn.style.display = "inline-block";
  skipBtn._skipTarget = { text, callback };
  let i = 0;
  function type() {
    if (myId !== currentTypeId) return;
    if (i < text.length) {
      story.insertBefore(document.createTextNode(text.charAt(i)), skipBtn);
      i++;
      setTimeout(type, delay);
    } else {
      skipBtn.style.display = "none";
      if (callback) callback();
    }
  }
  type();
}

function skipTyping() {
  if (skipBtn._skipTarget) {
    const { text, callback } = skipBtn._skipTarget;
    currentTypeId++;
    story.textContent = text;
    story.appendChild(skipBtn);
    skipBtn.style.display = "none";
    if (callback) callback();
  }
}

window.onload = function () {
  const introText = `\nThe supernatural society was a place of fear and danger...`;
  typeText(introText);
};

function startGame() {
  currentTypeId++;
  story.textContent = "";
  player.name = input.value.trim() || "Reaper";
  document.getElementById("input-container").style.display = "none";
  introImg.style.display = "none";
  document.getElementById("scene-container").style.display = "flex";
  document.getElementById("stats").style.display = "block";
  document.getElementById("options").style.display = "block";
  loadScene();
}

function loadScene() {
  if (window.curSceneIndex >= scenes.length) window.curSceneIndex = 0;
  const scene = scenes[window.curSceneIndex];
  sceneImg.src = scene.img + "?v=" + Date.now();
  bossImg.src = scene.enemy.img + "?v=" + Date.now();
  bossImg.style.display = "block";
  try {
    bgMusic.src = scene.music;
    bgMusic.play().catch(() => {});
  } catch {}
  enemy = { ...scene.enemy };
  updateStats();
  nextSceneBtn.style.display = "none";
  typeText(scene.description + "\n\n", 30, showCombatOptions);
}

function nextScene() {
  if (window.curSceneIndex < scenes.length - 1) {
    window.curSceneIndex++;
    loadScene();
  } else {
    bossImg.style.display = "none";
    nextSceneBtn.style.display = "none";
    typeText(`Congratulations, ${player.name}! You have completed all scenes.`);
  }
}

function updateStats() {
  healthEl.textContent = `${player.health}/${player.maxHealth}`;
  armorEl.textContent = player.armor + player.armorItem.bonus;
  enemyNameEl.textContent = enemy.name;
  enemyHealthEl.textContent = enemy.health;
}

function showCombatOptions() {
  options.innerHTML = `
    <button onclick="showAttackChoices()">Fight</button>
    <button onclick="doAction('potion')">Use Potion</button>
    <button onclick="doAction('armor')">Pick up Armor</button>
    <button onclick="openInventory()">Inventory</button>
    <button onclick="viewStats()">View Stats</button>
  `;
  options.appendChild(nextSceneBtn);
}

function viewStats() {
  options.innerHTML = `
    <h3>${player.name}'s Stats</h3>
    <p>Level: ${player.level}</p>
    <p>XP: ${player.xp}</p>
    <p>Gold: ${player.gold}</p>
    <p>Health: ${player.health}/${player.maxHealth}</p>
    <p>Strength: ${player.strength}</p>
    <p>Speed: ${player.speed}</p>
    <p>Accuracy: ${player.accuracy}</p>
    <p>Weapon: ${player.weapon.name} (+${player.weapon.bonus})</p>
    <p>Armor: ${player.armorItem.name} (+${player.armorItem.bonus})</p>
    <button onclick="showCombatOptions()">Back</button>
  `;
}

function openInventory() {
  options.innerHTML = "<h3>Inventory</h3>";
  player.inventory.forEach((item, index) => {
    options.innerHTML += `<button onclick="equipItem(${index})">Equip ${item.name} (+${item.bonus})</button><br>`;
  });
  options.innerHTML += `<button onclick="showCombatOptions()">Back</button>`;
}

function equipItem(index) {
  const item = player.inventory[index];
  if (item.type === "weapon") {
    player.weapon = item;
  } else if (item.type === "armor") {
    player.armorItem = item;
  }
  showCombatOptions();
}

function showAttackChoices() {
  options.innerHTML = `
    <button onclick="doAction('quick')">Quick Attack</button>
    <button onclick="doAction('heavy')">Heavy Attack</button>
    <button onclick="doAction('special')">Special Attack</button>
    <button onclick="showCombatOptions()">Back</button>
  `;
}

let specialCooldown = 0;

function calculateHit(baseChance) {
  let modifiedChance = baseChance + (player.accuracy - 0.5) * 0.5 + player.speed * 0.01;
  return Math.random() <= modifiedChance;
}

function doAction(act) {
  if (enemy.health <= 0) return;
  let text = "";
  let damage = 0;
  const weaponBonus = player.weapon.bonus;

  if (act === "armor") {
    player.armor += 10;
    text = `${player.name} picks up armor (+10).`;
  } else if (act === "potion") {
    player.health = Math.min(player.health + 20, player.maxHealth);
    text = `${player.name} uses a potion (+20 HP).`;
  } else if (act === "quick") {
    if (calculateHit(0.9)) {
      damage = Math.floor(Math.random() * 4) + 3 + player.strength * 0.3 + weaponBonus;
      enemy.health = Math.max(0, enemy.health - damage);
      text = `${player.name} lands a Quick Attack with ${player.weapon.name} for ${damage} damage!`;
    } else {
      text = `${player.name}'s Quick Attack missed!`;
    }
  } else if (act === "heavy") {
    if (calculateHit(0.5)) {
      damage = Math.floor(Math.random() * 8) + 8 + player.strength * 0.5 + weaponBonus;
      enemy.health = Math.max(0, enemy.health - damage);
      text = `${player.name} lands a Heavy Attack with ${player.weapon.name} for ${damage} damage!`;
    } else {
      text = `${player.name}'s Heavy Attack missed!`;
    }
  } else if (act === "special") {
    if (specialCooldown > 0) {
      text = `Special Attack is on cooldown for ${specialCooldown} more turn(s)!`;
    } else {
      if (calculateHit(0.7)) {
        damage = Math.floor(Math.random() * 10) + 12 + player.strength * 0.7 + weaponBonus;
        enemy.health = Math.max(0, enemy.health - damage);
        text = `${player.name} unleashes a Special Attack with ${player.weapon.name} for ${damage} damage!`;
      } else {
        text = `${player.name}'s Special Attack missed!`;
      }
      specialCooldown = 3;
    }
  }

  updateStats();

  if (enemy.health <= 0) {
    options.innerHTML = "";
    options.appendChild(nextSceneBtn);
    nextSceneBtn.style.display = "inline-block";
    typeText(`${text}\nYou've defeated ${enemy.name}!`);

    player.xp += 10;
    player.gold += Math.floor(Math.random() * 10) + 5;

    if (player.xp >= player.level * 20) {
      player.level++;
      player.strength += 2;
      player.maxHealth += 10;
      player.health = player.maxHealth;
      player.speed += 1;
      player.accuracy += 0.02;
      typeText(`Level Up! ${player.name} is now level ${player.level}! Stats increased.`);
    }
    return;
  }

  if (specialCooldown > 0) specialCooldown--;

  enemyTurn(text);
}

function enemyTurn(prevText) {
  if (enemy.health <= 0) return;
  const dmg = Math.floor(Math.random() * enemy.strength) + 3;
  const armorAbsorb = Math.min(dmg, player.armor + player.armorItem.bonus);
  const healthDamage = dmg - armorAbsorb;
  player.armor -= armorAbsorb;
  player.health -= healthDamage;
  updateStats();
  typeText(
    `${prevText}\n${enemy.name} attacks! Damage: ${dmg} → Armor blocked: ${armorAbsorb}, HP lost: ${healthDamage}.`,
    showCombatOptions
  );
  checkPlayerDeath();
}

function checkPlayerDeath() {
  if (player.health <= 0) {
    typeText(`You have been defeated by ${enemy.name}. Game Over.`);
    options.innerHTML = "";
    nextSceneBtn.style.display = "none";
  }
}
