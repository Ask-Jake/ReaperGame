// DOM elements
const story = document.getElementById('story');
const input = document.getElementById('input');
const options = document.getElementById('options');
const healthEl = document.getElementById('health');
const armorEl = document.getElementById('armor');
const enemyNameEl = document.getElementById('enemy-name');
const enemyHealthEl = document.getElementById('enemy-health');
const sceneImg = document.getElementById('scene-img');
const bgMusic = document.getElementById('bg-music');

// Game state
let player = { name: '', health: 100, armor: 0, strength: 10 };
let enemy = null;
let curSceneIndex = 0;

// Scenes
const scenes = [
  {
    name: 'Temple',
    img: 'temple.png',
    music: 'temple.mp3',
    enemy: { name: 'Demon Boss', health: 50, strength: 8 },
    terrainDescription: `SCENE 1 – TEMPLE:
The camera pans over a foreboding temple in the depths of Hell.
The walls are made of charred obsidian, and glowing red symbols burn into the stone.
Flames flicker in braziers, casting macabre shadows across broken statues of demonic figures.
The air is thick with sulfuric smoke, and the only sounds are distant screams of damned souls echoing through the dark halls.
A feeling of malevolent power seems to suffuse the very air.`,
    introDialogue: () => {
      const name = player.name;
      return `
${name} was the first to take a stand against the demons and challenge their authority.
You have always been an outcast amongst the reapers, misunderstood and mocked for your tenacity.

You began a rebellion, recruiting those who longed for freedom. Battles were fought, losses endured.
Eventually, the demon CEO had no choice but to take notice and sent word to the Demon Boss.


The Demon Boss, with a troop of lesser demons, stormed toward the temple to crush the uprising.

Suddenly, a yell cuts through the air. The Reaper appears—the Demon Boss sneers.

${name}: "Demon Boss, your time has come. You’ve caused too much suffering."

Demon Boss: "Ha! Foolish reaper. Have you ever considered what it *means* to be a demon?"

${name}: "I understand the power… but also the responsibility. I won't let your darkness spread."

Demon Boss: "You can try, ${name}. But I won’t go down without a fight..."

The Reaper grips their scythe. The Demon Boss lunges. The first battle begins.
`;
    }
  }
];

// Typewriter effect
function typeText(text, delay = 30, callback) {
  story.innerHTML = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      story.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, delay);
    } else if (callback) callback();
  }
  type();
}

// Start game
function startGame() {
  player.name = input.value.trim() || 'Reaper';
  document.getElementById('input-container').style.display = 'none';
  document.getElementById('intro-img').style.display = 'none';
  sceneImg.style.display = 'block';

  loadScene();
}

// Load scene
function loadScene() {
  const scene = scenes[curSceneIndex];
  sceneImg.src = scene.img;
  bgMusic.src = scene.music;
  bgMusic.play();

  enemy = Object.assign({}, scene.enemy);
  updateStats();

  // Show terrain first, then dialogue, then combat
  typeText(scene.terrainDescription, 25, () => {
    setTimeout(() => {
      typeText(scene.introDialogue(), 30, showCombatOptions);
    }, 1000);
  });
}

// Show combat options
function showCombatOptions() {
  options.innerHTML = `
    <button onclick="doAction('armor')">Pick up Armor</button>
    <button onclick="doAction('potion')">Use Potion</button>
    <button onclick="doAction('fight')">Fight</button>
  `;
}

// Player action
function doAction(action) {
  let text = '';
  const damage = Math.floor(Math.random() * player.strength) + 5;

  switch (action) {
    case 'armor':
      player.armor += 5;
      text = `${player.name} picks up armor (+5).`;
      break;
    case 'potion':
      player.health = Math.min(player.health + 20, 100);
      text = `${player.name} uses a potion (+20 HP).`;
      break;
    case 'fight':
      enemy.health -= damage;
      text = `${player.name} hits ${enemy.name} for ${damage} damage.`;
      break;
  }

  updateStats();

  if (action !== 'fight' || enemy.health > 0) {
    enemyTurn(text);
  } else {
    endBattle(text);
  }
}

// Enemy attack
function enemyTurn(prevText) {
  const dmg = Math.max(0, Math.floor(Math.random() * enemy.strength) + 3 - player.armor);
  player.health -= dmg;
  player.armor = Math.max(0, player.armor - dmg);
  updateStats();
  typeText(`${prevText}\n${enemy.name} hits you for ${dmg}.`, showCombatOptions);
  checkPlayerDeath();
}

// Battle end
function endBattle(prevText) {
  typeText(`${prevText}\nYou've defeated ${enemy.name}!`, () => {
    curSceneIndex++;
    if (curSceneIndex < scenes.length) {
      loadScene();
    } else {
      typeText("Congratulations! All demons defeated.");
    }
  });
}

// Update UI stats
function updateStats() {
  healthEl.textContent = player.health;
  armorEl.textContent = player.armor;
  enemyNameEl.textContent = enemy ? enemy.name : '';
  enemyHealthEl.textContent = enemy ? enemy.health : '';
}

// Check player death
function checkPlayerDeath() {
  if (player.health <= 0) {
    typeText("You've been defeated... Game over.");
    options.innerHTML = '';
  }
}
