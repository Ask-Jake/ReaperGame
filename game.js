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

// Create Continue Adventure button dynamically
const nextSceneBtn = document.createElement("button");
nextSceneBtn.textContent = "Continue Adventure";
nextSceneBtn.style.display = "none";
nextSceneBtn.onclick = nextScene;
document.body.appendChild(nextSceneBtn);

// Ensure scene index exists and is valid
if (typeof window.curSceneIndex === "undefined" || typeof window.curSceneIndex !== "number" || window.curSceneIndex < 0) {
  window.curSceneIndex = 0;
}
console.log("GAME.JS LOADED! curSceneIndex =", window.curSceneIndex);

let player = { name: "", health: 100, armor: 0, strength: 10 };
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
      const charNode = document.createTextNode(text.charAt(i));
      story.insertBefore(charNode, skipBtn);
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
  const introText = `\nThe supernatural society was a place of fear and danger...\nOne reaper dared to resist... and their story begins now.`;
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
  if (typeof window.curSceneIndex !== "number" || window.curSceneIndex < 0 || window.curSceneIndex >= scenes.length) {
    window.curSceneIndex = 0;
  }
  const scene = scenes[window.curSceneIndex];
  if (!scene) return;

  sceneImg.src = scene.img + "?v=" + Date.now();
  bossImg.src = scene.enemy.img + "?v=" + Date.now();
  bossImg.style.display = "block";

  try {
    bgMusic.src = scene.music;
    bgMusic.play().catch(() => {});
  } catch (e) {}

  enemy = { ...scene.enemy };
  updateStats();
  nextSceneBtn.style.display = "none"; // Ensure hidden until boss is defeated

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
  healthEl.textContent = player.health;
  armorEl.textContent = player.armor;
  enemyNameEl.textContent = enemy.name;
  enemyHealthEl.textContent = enemy.health;
}

function showCombatOptions() {
  options.innerHTML = `
    <button onclick="doAction('armor')">Pick up Armor</button>
    <button onclick="doAction('potion')">Use Potion</button>
    <button onclick="doAction('fight')">Fight</button>
  `;
}

function doAction(act) {
  if (enemy.health <= 0) return;

  let text = "";
  const damage = Math.floor(Math.random() * player.strength) + 5;

  if (act === "armor") {
    player.armor += 10;
    text = `${player.name} picks up armor (+10).`;
  } else if (act === "potion") {
    player.health = Math.min(player.health + 10, 100);
    text = `${player.name} uses a potion (+10 HP).`;
  } else if (act === "fight") {
    enemy.health = Math.max(0, enemy.health - damage);
    text = `${player.name} hits ${enemy.name} for ${damage} damage.`;
  }

  updateStats();

  if (enemy.health <= 0) {
    options.innerHTML = "";
    endBattle(text);
    return;
  }

  enemyTurn(text);
}

function enemyTurn(prevText) {
  if (enemy.health <= 0) return;

  const dmg = Math.floor(Math.random() * enemy.strength) + 3;
  const armorAbsorb = Math.min(dmg, player.armor);
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
  }
}

function endBattle(prevText) {
  typeText(`${prevText}\nYou've defeated ${enemy.name}!`, () => {
    options.innerHTML = "";
    nextSceneBtn.style.display = "inline-block";
  });
}
