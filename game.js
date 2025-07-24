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
const introImg = document.getElementById('intro-img');

let player = { name: '', health: 100, armor: 0, strength: 10 };
let enemy = null;

// Intro story text
const introText = `The supernatural society was a place of fear and danger.
It was filled with powerful and malevolent demons, dark magic,
and a rigid hierarchy where the demons held absolute power over the grim reapers.
The grim reapers were forced to do the bidding of the demons, which included killing humans to reap their souls.
This violated the natural order of life and caused many of the reapers to want freedom and to fight for it — but only one would act.`;

// Scene configuration
const scenes = [
  {
    name: 'The Temple',
    img: 'temple.png',
    music: 'temple.mp3',
    description: `\nSCENE 1: TEMPLE — The camera pans over a foreboding temple in the depths of Hell.
The walls are made of charred obsidian, and glowing red symbols burn into the stone.
Flames flicker in braziers, casting macabre shadows across broken statues of demonic figures.
The air is thick with sulfuric smoke, and the only sounds are distant screams of damned souls echoing through the dark halls.
A feeling of malevolent power seems to suffuse the very air.`,
    enemy: { name: 'Demon Boss', health: 50, strength: 8 }
  },
  {
    name: 'Forest',
    img: 'forest.png',
    music: 'forest.mp3',
    description: 'You enter a haunted forest, the trees clawing at the sky like twisted limbs.',
    enemy: { name: 'Demon Supervisor', health: 80, strength: 12 }
  },
  {
    name: 'Metropolis',
    img: 'city.png',
    music: 'city.mp3',
    description: 'A futuristic hellish city rises around you, neon glowing through ash-filled skies.',
    enemy: { name: 'Demon CEO', health: 150, strength: 20 }
  }
];

let curSceneIndex = 0;

// Typewriter effect
function typeText(text, delay = 25, callback) {
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

// Display intro story on page load
window.onload = () => {
  typeText(introText);
};

// Start game
function startGame() {
  player.name = input.value.trim() || 'Reaper';
  document.getElementById('input-container').style.display = 'none';
  introImg.style.display = 'none';       // hide Grim Reaper image
  sceneImg.style.display = 'block';      // show scene image
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
  typeText(`${scene.description}\n\nYou face the ${enemy.name}.`, showCombatOptions);
}

// Show player action options
function showCombatOptions() {
  options.innerHTML = `
    <button onclick="doAction('armor')">Pick up Armor</button>
    <button onclick="doAction('potion')">Use Potion</button>
    <button onclick="doAction('fight')">Fight</button>
  `;
}

// Player takes an action
function doAction(act) {
  let text = '';
  const damage = Math.floor(Math.random() * player.strength) + 5;
  switch (act) {
    case 'armor':
      player. armor += 5;
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
  if (act !== 'fight') enemyTurn(text);
  else if (enemy.health > 0) enemyTurn(text);
  else endBattle(text);
}

// Enemy attacks
function enemyTurn(prevText) {
  const dmg = Math.max(0, Math.floor(Math.random() * enemy.strength) + 3 - player.armor);
  player.health -= dmg;
  player.armor = Math.max(0, player.armor - dmg);
  updateStats();
  typeText(`${prevText}\n${enemy.name} hits you for ${dmg}.`, showCombatOptions);
  checkPlayerDeath();
}

// End of battle
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

// Update stat elements
function updateStats() {
  healthEl.textContent = player.health;
  armorEl.textContent = player.armor;
  enemyNameEl.textContent = enemy? enemy.name: '';
  enemyHealthEl.textContent = enemy? enemy.health: '';
}

// Check for player defeat
function checkPlayerDeath() {
  if (player.health <= 0) {
    typeText("You've been defeated... Game over.");
    options.innerHTML = '';
  }
}
