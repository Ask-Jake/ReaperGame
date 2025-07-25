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

if (typeof window.curSceneIndex === "undefined") {
  window.curSceneIndex = 0;
}

let player = { name: "", health: 100, armor: 0, strength: 10 };
let enemy = null;
let currentTypeId = 0;

// Scenes
const scenes = [
  {
    name: "Temple",
    img: "scene1-temple.png",
    music: "temple.mp3",
    enemy: { name: "Demon Boss", health: 50, strength: 8, img: "Demonboss.png" },
    description: `SCENE 1 – TEMPLE:
The camera pans over a foreboding temple in the depths of Hell...
The battle for the supernatural world begins now.`
  },
  {
    name: "Forest",
    img: "scene2-forest.png",
    music: "forest.mp3",
    enemy: { name: "Demon Supervisor", health: 80, strength: 12, img: "demonSupervisor.png" },
    description: `SCENE 2 – FOREST:
A twisted forest of gnarled trees illuminated by the red glow of Hell.`
  },
  {
    name: "Metropolis",
    img: "scene3-city.png",
    music: "city.mp3",
    enemy: { name: "Demon CEO", health: 150, strength: 20, img: "demonCEO.png" },
    description: `FINAL SCENE 3 – METROPOLIS:
A sprawling infernal city with jagged spires and fiery rivers.`
  }
];

// Typewriter
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

// ✅ Show SHORT intro when page loads
window.onload = function () {
  const shortIntro = `
The supernatural society was a place of fear and danger.
It was filled with powerful and malevolent demons, dark magic,
and a rigid hierarchy where the demons held absolute power over the grim reapers.
The grim reapers were forced to do the bidding of the demons,
which included killing humans to reap their souls.

One reaper dared to resist... and their story begins now.
`;
  typeText(shortIntro);
};

// ✅ Start Game
function startGame() {
  player.name = input.value.trim() || "Reaper";

  // Hide intro image & input
  introImg.style.display = "none";
  document.getElementById("input-container").style.display = "none";

  // Extended story BEFORE scene loads
  const fullIntro = `
${player.name} was the first to take a stand against the demons and challenge their authority.
You've always been an outcast among the reapers, mocked and misunderstood for your vision of freedom.

You began a rebellion, traveling to different regions, recruiting allies who sought freedom.
Through battles and bloodshed, your army grew into a powerful force.

Eventually, the Demon CEO took notice. He dispatched his apprentice to alert the Demon Boss,
who rallied his forces and headed for the temple to destroy you himself.

${player.name}: Demon Boss, your time has come. You have caused too much suffering. It ends now.

Demon Boss: Ha — Grim Reaper, you have always been a self-righteous fool.
Have you ever considered that demons revel in the suffering you abhor?

${player.name}: I understand our power. But I also understand the responsibility that comes with it.
I won't let you spread your darkness any longer.

Demon Boss: Then come, reaper. But know I will not fall without a fight.

The Demon Boss lashes out with razor-sharp claws. You block with your scythe,
blades clashing in bursts of sparks. The battle for the supernatural world begins now.
`;

  typeText(fullIntro, 30, () => {
    document.getElementById("scene-container").style.display = "flex";
    document.getElementById("stats").style.display = "block";
    document.getElementById("options").style.display = "block";
    loadScene();
  });
}

// ✅ Rest of the functions (loadScene, updateStats, doAction, enemyTurn, endBattle)
// Use EXACTLY the same fixed versions from before (with fade-in/out and boss image display)

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

