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

let player = { name: "", health: 100, armor: 0, strength: 10 };
let enemy = null;
let currentTypeId = 0;

const scenes = [
  {
    name: "Temple",
    img: "temple.png",
    music: "temple.mp3",
    enemy: { name: "Demon Boss", health: 50, strength: 8, img: "Demonboss.png" },
    description: `SCENE 1 – TEMPLE:\nThe camera pans over a foreboding temple in the depths of Hell.\nThe walls are made of charred obsidian, and glowing red symbols burn into the stone.\nFlames flicker in braziers, casting macabre shadows across broken statues of demonic figures.\nThe air is thick with sulfuric smoke, and the only sounds are distant screams of damned souls echoing through the dark halls.\nA feeling of malevolent power seems to suffuse the very air.`
  },
  {
    name: "Forest",
    img: "forest.png",
    music: "forest.mp3",
    enemy: { name: "Demon Supervisor", health: 80, strength: 12, img: "demonSupervisor.png" },
    description: `SCENE 2 – FOREST:\nThe camera traverses through a twisted forest, the trees resembling gnarled fingers reaching toward the ominous sky.\nThe red glow of the inferno illuminates the branches, casting an eerie aura over the surroundings.\nThe ground is scorched and barren, emitting heat like burning coals.\nMalicious spirits materialize and vanish in flashes of flame, their shrieks echoing in the infernal air.`
  },
  {
    name: "Metropolis",
    img: "city.png",
    music: "city.mp3",
    enemy: { name: "Demon CEO", health: 150, strength: 20, img: "demonCEO.png" },
    description: `FINAL SCENE 3 – METROPOLIS:\nA sprawling infernal metropolis stretches endlessly before you, jagged spires stabbing the dark sky.\nFiery rivers cut through streets lined with twisted buildings, each filled with demonic figures whispering and plotting.\nThe air crackles with nether energy, and screams reverberate through the tortured landscape.`
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
  const introText = `\nThe supernatural society was a place of fear and danger.\nIt was filled with powerful and malevolent demons, dark magic,\nand a rigid hierarchy where the demons held absolute power over the grim reapers.\nThe grim reapers were forced to do the bidding of the demons, which included killing humans to reap their souls.\nThis violated the natural order of life and caused many reapers to seek freedom.\n\nOne reaper dared to resist... and their story begins now.`;
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
  healthEl.textContent = player.health;
  armorEl.textContent = player.armor;
  enemyNameEl.textContent = enemy.name;
  enemyHealthEl.textContent = enemy.health;
}

function showCombatOptions() {
  options.innerHTML = `
    <button onclick="showAttackChoices()">Fight</button>
    <button onclick="doAction('potion')">Use Potion</button>
    <button onclick="doAction('armor')">Pick up Armor</button>
  `;
  options.appendChild(nextSceneBtn);
}

function showAttackChoices() {
  options.innerHTML = `
    <button onclick="doAction('quick')">Quick Attack</button>
    <button onclick="doAction('heavy')">Heavy Attack</button>
    <button onclick="doAction('special')">Special Attack</button>
  `;
}

let specialCooldown = 0;

function doAction(act) {
  if (enemy.health <= 0) return;
  let text = "";
  let damage = 0;

  if (act === "armor") {
    player.armor += 10;
    text = `${player.name} picks up armor (+10).`;
  } else if (act === "potion") {
    player.health = Math.min(player.health + 10, 100);
    text = `${player.name} uses a potion (+10 HP).`;
  } else if (act === "quick") {
    const hitChance = 0.9;
    damage = Math.floor(Math.random() * 4) + 3;
    text = Math.random() <= hitChance ? `${player.name} hits ${enemy.name} with a Quick Attack for ${damage} damage!` : `${player.name}'s Quick Attack missed!`;
    if (Math.random() <= hitChance) enemy.health = Math.max(0, enemy.health - damage);
  } else if (act === "heavy") {
    const hitChance = 0.5;
    damage = Math.floor(Math.random() * 8) + 8;
    text = Math.random() <= hitChance ? `${player.name} hits ${enemy.name} with a Heavy Attack for ${damage} damage!` : `${player.name}'s Heavy Attack missed!`;
    if (Math.random() <= hitChance) enemy.health = Math.max(0, enemy.health - damage);
  } else if (act === "special") {
    if (specialCooldown > 0) {
      text = `Special Attack is on cooldown for ${specialCooldown} more turn(s)!`;
    } else {
      damage = Math.floor(Math.random() * 10) + 12;
      enemy.health = Math.max(0, enemy.health - damage);
      text = `${player.name} unleashes a Special Attack for ${damage} damage!`;
      specialCooldown = 3;
    }
  }

  updateStats();

  if (enemy.health <= 0) {
    options.innerHTML = `
      <button onclick="showAttackChoices()">Fight</button>
      <button onclick="doAction('potion')">Use Potion</button>
      <button onclick="doAction('armor')">Pick up Armor</button>`;
    options.appendChild(nextSceneBtn);
    nextSceneBtn.style.display = "inline-block";
    typeText(`${text}\nYou've defeated ${enemy.name}!`);
    return;
  }

  if (specialCooldown > 0) specialCooldown--;

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
    nextSceneBtn.style.display = "none";
  }
}
