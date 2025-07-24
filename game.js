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

// Scenes configuration
const scenes = [
  {
    name: 'Temple',
    img: 'temple.png',
    music: 'temple.mp3',
    enemy: { name: 'Demon Boss', health: 50, strength: 8 }
  },
  {
    name: 'Forest',
    img: 'forest.png',
    music: 'forest.mp3',
    enemy: { name: 'Demon Supervisor', health: 80, strength: 12 }
  },
  {
    name: 'Metropolis',
    img: 'city.png',
    music: 'city.mp3',
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

// Start game
function startGame() {
  player.name = input.value.trim() || 'Reaper';

  // Hide input and Grim Reaper image
  document.getElementById('input-container').style.display = 'none';
  introImg.style.display = 'none';

  // Show scene image
  sceneImg.style.display = 'block';

  // Load first scene
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
  typeText(`Scene: ${scene.name}. You face the ${enemy.name}.`, showCombatOptions);
}

// Show options
function showCombatOptions() {
  options.innerHTML = `
    <button onclick="doAction('armor')">Pick up Armor</button>
    <button onclick="doAction('potion')">Use Potion</button>
    <button onclick="doAction('fight')">Fight</button>
  `;
}

// Player action
function doAction(action) {
  let result = '';
  const damage = Math.floor(Math.random() * player.strength) + 5;

  switch (action) {
    case 'armor':
      player. armor += 5;
      result = `${player.name} picks up armor (+5).`;
      break;
    case 'potion':
      player.health = Math.min(player.health + 20, 100);
      result = `${player.name} uses a potion (+20 HP).`;
      break;
    case 'fight':
      enemy.health -= damage;
      result = `${player.name} hits ${enemy.name} for ${damage} damage.`;
      break;
  }

  updateStats();

  if (action !== 'fight') {
    enemyTurn(result);
  } else if (enemy.health > 0) {
    enemyTurn(result);
  } else {
    endBattle(result);
  }
}

// Enemy's turn
function enemyTurn(prevText) {
  const dmg = Math.max(0, Math.floor(Math.random() * enemy.strength) + 3 - player.armor);
  player.health -= dmg;
  player.armor = Math.max(0, player.armor - dmg);
  updateStats();
  typeText(`${prevText}\n${enemy.name} hits you for ${dmg}.`, showCombatOptions);
  checkPlayerDeath();
}

// End battle
function endBattle(prevText) {
  typeText(`${prevText}\nYou've defeated ${enemy.name}!`, () => {
    curSceneIndex++;
    if (curSceneIndex < scenes.length) {
      loadScene();
    } else {
      typeText("Congratulations! All demons defeated.");
      sceneImg.style.display = 'none';
    }
  });
}

// Update stats
function updateStats() {
  healthEl.textContent = player.health;
  armorEl.textContent = player.armor;
  enemyNameEl.textContent = enemy? enemy.name: '';
  enemyHealthEl.textContent = enemy? enemy.health: '';
}

// Check if player died
function checkPlayerDeath() {
  if (player.health <= 0) {
    typeText("You've been defeated... Game over.");
    options.innerHTML = '';
    sceneImg.style.display = 'none';
  }
}
