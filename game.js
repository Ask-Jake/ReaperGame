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

// ✅ Ensure scene index always exists globally
window.curSceneIndex = window.curSceneIndex ?? 0;
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
    description: `SCENE 1 – TEMPLE:
The camera pans over a foreboding temple in the depths of Hell.
The walls are made of charred obsidian, and glowing red symbols burn into the stone.
Flames flicker in braziers, casting macabre shadows across broken statues of demonic figures.
The air is thick with sulfuric smoke, and the only sounds are distant screams of damned souls echoing through the dark halls.
A feeling of malevolent power seems to suffuse the very air.`
  },
  {
    name: "Forest",
    img: "forest.png",
    music: "forest.mp3",
    enemy: { name: "Demon Supervisor", health: 80, strength: 12, img: "demonSupervisor.png" },
    description: `SCENE 2 – FOREST:
The camera traverses through a twisted forest, the trees resembling gnarled fingers reaching toward the ominous sky.
The red glow of the inferno illuminates the branches, casting an eerie aura over the surroundings.
The ground is scorched and barren, emitting heat like burning coals.
Malicious spirits materialize and vanish in flashes of flame, their shrieks echoing in the infernal air.`
  },
  {
    name: "Metropolis",
    img: "city.png",
    music: "city.mp3",
    enemy: { name: "Demon CEO", health: 150, strength: 20, img: "demonCEO.png" },
    description: `FINAL SCENE 3 – METROPOLIS:
A sprawling infernal metropolis stretches endlessly before you, jagged spires stabbing the dark sky.
Fiery rivers cut through streets lined with twisted buildings, each filled with demonic figures whispering and plotting.
The air crackles with nether energy, and screams reverberate through the tortured landscape.`
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
  const introText = `
(Fixed?) The supernatural society was a place of fear and danger.
It was filled with powerful and malevolent demons, dark magic,
and a rigid hierarchy where the demons held absolute power over the grim reapers.
The grim reapers were forced to do the bidding of the demons, which included killing humans to reap their souls.
This violated the natural order of life and caused many reapers to seek freedom.

One reaper dared to resist... and their story begins now.
`;
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
  console.log("Loading scene index:", window.curSceneIndex);

  const scene = scenes[window.curSceneIndex];

  sceneImg.src = scene.img + "?v=" + Date.now();
  bossImg.src = scene.enemy.img + "?v=" + Date.now();
  bossImg.style.display = "block";

  try {
    bgMusic.src = scene.music;
    bgMusic.play().catch(err => console.warn("Audio play failed:", err));
  } catch (e) {
    console.warn("Audio load/play error:", e);
  }

  enemy = { ...scene.enemy };
  updateStats();

  typeText(scene.description + "\n\n", 30, showCombatOptions);
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
    console.log("Enemy HP after attack:", enemy.health);
    text = `${player.name} hits ${enemy.name} for ${damage} damage.`;
  }

  updateStats();

  if (enemy.health <= 0) {
    console.log("Enemy defeated → Calling endBattle()");
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
  console.log("endBattle() called. Current scene index:", window.curSceneIndex);

  typeText(`${prevText}\nYou've defeated ${enemy.name}!`, () => {
    options.innerHTML = "";

    if (window.curSceneIndex < scenes.length) {
      console.log(scenes.length);
      window.curSceneIndex = Number(window.curSceneIndex) + 1;
      console.log("Scene index incremented to:", window.curSceneIndex);

      setTimeout(() => {
        console.log("Loading new scene...");
        loadScene();
      }, 1000);

    } else {
      bossImg.style.display = "none";
      typeText(
        `Congratulations, ${player.name}! You have defeated the Demon CEO, freed the reapers, and restored balance to the supernatural world!`
      );
    }
  });
}

