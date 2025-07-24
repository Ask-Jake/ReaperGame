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
function typeText(text, delay = 50, callback) {
  story.innerHTML = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      story.textcontent += text.charAt(i);
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
  document.getElementById('scene-img').style.display = 'block';
  loadScene();
}

// Load scene with full intro for Scene 1
function loadScene() {
  const scene = scenes[curSceneIndex];
  sceneImg.src = scene.img;
  bgMusic.src = scene.music;
  bgMusic.play();

  enemy = Object.assign({}, scene.enemy);
  updateStats();

  let introText = '';

  if (curSceneIndex === 0) {
    introText =
      `\nSCENE 1 - THE TEMPLE: The camera pans over a foreboding temple in the depths of Hell.\n` +
      `The walls are made of charred obsidian, and glowing red symbols burn into the stone.\n` +
      `Flames flicker in braziers, casting macabre shadows across broken statues of demonic figures` +
      `The air is thick with sulfuric smoke, and the only sounds are distant screams of damned souls echoing through the dark halls.\n` +
      `A feeling of malevolent power seems to suffuse the very air` +

      `${player.name} was the first to take a stand against the demons and challenge their authority.\n` +
      `You have always been an outcast amongst the reapers. The others feared your dream of freedom.\n` +
      `They mocked you, yet deep inside, you knew the truth and stood strong.\n\n` +

      `You began a rebellion, traveling through the demon society recruiting those brave enough to fight.\n` +
      `The Demon CEO noticed your rise and sent his apprentice to warn the Demon Boss` +
      `In response, the Demon Boss rallied his minions and marched to the demonic temple, where you waited.\n\n` +

      `As the Demon Boss arrived, a voice yelled from behind him.` +
      The first fight between the Grim Reaper and the Demon Boss began.\n` +

      `${player.name}: Demon Boss, your time has come. You’ve caused enough pain.\n` +
      `Demon Boss: Ha—ha! Reaper, ever the fool. Do you even grasp what it means to be a demon?\n` +
      `${player.name}: Power must come with responsibility. I will end your reign of darkness.\n` +
      `Demon Boss: You can try, ${player.name}. But I won’t go down without a fight.\n\n` +

      `The Reaper readied his scythe. The Demon boss lunged with savage claws. Their battle begins...`;
  } else {
    introText = `Scene: ${scene.name}. You face the ${enemy.name}.`;
  }

  typeText(introText, 25, showCombatOptions);
}

// Show combat buttons
function showCombatOptions() {
  options.innerHTML = `
    <button onclick="doAction('armor')">Pick up Armor</button>
    <button onclick="doAction('potion')">Use Potion</button>
    <button onclick="doAction('fight')">Fight</button>
  `;
}

// Player actions
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

// Enemy action
function enemyTurn(prevText) {
  const dmg = Math.max(0, Math.floor(Math.random() * enemy.strength) + 3 - player.armor);
  player.health -= dmg;
  player.armor = Math.max(0, player.armor - dmg);
  updateStats();
  typeText(`${prevText}\n${enemy.name} hits you for ${dmg}.`, showCombatOptions);
  checkPlayerDeath();
}

// Battle result
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

// Stats update
function updateStats() {
  healthEl.textContent = player.health;
  armorEl.textContent = player.armor;
  enemyNameEl.textContent = enemy? enemy.name: '';
  enemyHealthEl.textContent = enemy? enemy.health: '';
}

// Game over check
function checkPlayerDeath() {
  if (player.health <= 0) {
    typeText("You've been defeated... Game over.");
    options.innerHTML = '';
  }
}
