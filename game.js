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

if (typeof window.curSceneIndex === "undefined") window.curSceneIndex = 0;

let player = { name: "", health: 100, armor: 0, strength: 10 };
let enemy = null;
let currentTypeId = 0;

const scenes = [
  {
    name: "Temple",
    img: "temple.png",
    music: "temple.mp3",
    enemy: { name: "Demon Boss", health: 50, strength: 8, img: "Demonboss.png" },
    description: `SCENE 1 – TEMPLE:\nThe camera pans over a foreboding temple in the depths of Hell.\nThe walls are made of charred obsidian, and glowing red symbols burn into the stone.\nFlames flicker in braziers, casting macabre shadows across broken statues of demonic figures.\nThe air is thick with sulfuric smoke, and the only sounds are distant screams of damned souls echoing through the dark halls.\nA feeling of malevolent power seems to suffuse the very air.`,
    dialogue: [
      "Demon Boss: Ha — Grim Reaper, you have always been a self-righteous fool.",
      "Grim Reaper: Demon Boss, your time has come. It ends now.",
      "Demon Boss: Then come, reaper. But know I will not fall without a fight."
    ]
  },
  {
    name: "Forest",
    img: "forest.png",
    music: "forest.mp3",
    enemy: { name: "Demon Supervisor", health: 80, strength: 12, img: "demonSupervisor.png" },
    description: `SCENE 2 – FOREST:\nThe camera traverses through a twisted forest, the trees resembling gnarled fingers reaching toward the ominous sky.\nThe red glow of the inferno illuminates the branches, casting an eerie aura over the surroundings.\nThe ground is scorched and barren, emitting heat like burning coals.\nMalicious spirits materialize and vanish in flashes of flame, their shrieks echoing in the infernal air.`,
    dialogue: [
      "Demon Supervisor: You made it this far, but you won’t defeat me!",
      "Grim Reaper: I’ve defeated worse than you. Your reign ends here.",
      "Demon Supervisor: Then face me, reaper!"
    ]
  },
  {
    name: "Metropolis",
    img: "city.png",
    music: "city.mp3",
    enemy: { name: "Demon CEO", health: 150, strength: 20, img: "demonCEO.png" },
    description: `FINAL SCENE 3 – METROPOLIS:\nA sprawling infernal metropolis stretches endlessly before you, jagged spires stabbing the dark sky.\nFiery rivers cut through streets lined with twisted buildings, each filled with demonic figures whispering and plotting.\nThe air crackles with nether energy, and screams reverberate through the tortured landscape.`,
    dialogue: [
      "Demon CEO: You dare challenge me, the ruler of this realm?",
      "Grim Reaper: I fight for freedom. Your tyranny ends now!",
      "Demon CEO: Then perish, reaper!"
    ]
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
  (function type() {
    if (myId !== currentTypeId) return;
    if (i < text.length) {
      story.insertBefore(document.createTextNode(text.charAt(i)), skipBtn);
      i++;
      setTimeout(type, delay);
    } else {
      skipBtn.style.display = "none";
      if (callback) callback();
    }
  })();
}

function skipTyping() {
  if (!skipBtn._skipTarget) return;
  const { text, callback } = skipBtn._skipTarget;
  currentTypeId++;
  story.textContent = text;
  story.appendChild(skipBtn);
  skipBtn.style.display = "none";
  if (callback) callback();
}

window.onload = () => {
  const introText = `The supernatural society was a place of fear and danger...\nOne reaper dared to resist... and their story begins now.`;
  typeText(introText);
};

function startGame() {
  player.name = input.value.trim() || "Reaper";
  document.getElementById("input-container").style.display = "none";
  introImg.style.display = "none";

  document.getElementById("scene-container").style.display = "flex";
  document.getElementById("stats").style.display = "block";
  document.getElementById("options").style.display = "block";

  loadScene();
}

function loadScene() {
  const scene = scenes[window.curSceneIndex];

  sceneImg.classList.add("fade-out");
  bossImg.classList.add("fade-out");

  setTimeout(() => {
    sceneImg.src = scene.img + "?v=" + Date.now();
    bossImg.src = scene.enemy.img + "?v=" + Date.now();
    bossImg.style.display = "block";

    sceneImg.onload = bossImg.onload = () => {
      sceneImg.classList.remove("fade-out");
      bossImg.classList.remove("fade-out");
      sceneImg.classList.add("fade-in");
      bossImg.classList.add("fade-in");
    };

    try {
      bgMusic.src = scene.music;
      bgMusic.play().catch(() => {});
    } catch {}

    enemy = { ...scene.enemy };
    updateStats();

    typeText(scene.description + "\n\n", 30, () => playDialogue(scene.dialogue, 0));
  }, 400);
}

function playDialogue(lines, index) {
  if (index < lines.length) {
    typeText(lines[index] + "\n\n", 30, () => playDialogue(lines, index + 1));
  } else {
    showCombatOptions();
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
    <button onclick="doAction('fight')">Fight</button>`;
}

function doAction(act) {
  if (enemy.health <= 0) return;

  const damage = Math.floor(Math.random() * player.strength) + 5;
  let text = "";

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
  if (enemy.health <= 0) return endBattle(text);
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

  if (player.health <= 0) {
    typeText(`You have been defeated by ${enemy.name}. Game Over.`);
    options.innerHTML = "";
  }
}

function endBattle(prevText) {
  typeText(`${prevText}\nYou've defeated ${enemy.name}!`, () => {
    options.innerHTML = "";

    if (window.curSceneIndex < scenes.length - 1) {
      window.curSceneIndex++;
      loadScene();
    } else {
      bossImg.style.display = "none";
      typeText(`Congratulations, ${player.name}! You have defeated the Demon CEO, freed the reapers, and restored balance to the supernatural world!`);
    }
  });
}

