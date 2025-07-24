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

const scenes = [
  {
    name: 'Temple',
    img: 'temple.png',
    music: 'temple.mp3',
    description: `SCENE 1: TEMPLE – The camera pans over a foreboding temple in the depths of Hell.
The walls are made of charred obsidian, and glowing red symbols burn into the stone.
Flames flicker in braziers, casting macabre shadows across broken statues of demonic figures.
The air is thick with sulfuric smoke, and the only sounds are distant screams of damned souls echoing through the dark halls.
A feeling of malevolent power seems to suffuse the very air.`,
    enemy: { name: 'Demon Boss', health: 50, strength: 8 }
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
  document.getElementById('input-container').style.display = 'none';
  document.getElementById('intro-img').style.display = 'none';
  document.getElementById('scene-img').style.display = 'block';
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

  typeText(`${scene.description}`, 30, () => {
    setTimeout(() => {
      showIntroDialogue();
    }, 3000); // 3 second pause
  });
}

// Intro cutscene dialogue
function showIntroDialogue() {
  const dialogue = `
${player.name} was the first to take a stand against the demons and challenge their authority.

You have always been an outcast amongst the reapers, with none of them understanding—
Or too scared to try and understand—your wish for freedom and rebellion against the will of the demons.

You were teased and mocked by the other reapers who did not join your cause,
But you knew deep down that you were right and were determined to make a stand.

You began a rebellion, traveling to different parts of the demon society,
recruiting those who wanted freedom from the demons' cruel rule.
You fought many battles, sustaining heavy losses, but eventually your numbers grew.

This powerful force caught the eye of the Demon CEO.
He sent his most trusted apprentice to alert the Demon Boss.

The Demon Boss, hearing of the uprising, gathered a group of lower-level demons
and headed to the temple to crush the rebellion at its source.

Just before entering, he heard a voice behind him.

${player.name}: Demon Boss, your time has come. You’ve caused too much suffering. It’s time to pay the price.

Demon Boss: Ha-ha! Grim Reaper… you always were a self-righteous fool.
Do you even know what it means to be a demon?

${player.name}: I understand the power that comes with our roles—and the responsibility.
I will not let you continue to spread darkness.

Demon Boss: You can try, ${player.name}, but I won’t go down without a fight.

The first battle begins…
  `;

  typeText(dialogue, 20, () => {
    showCombatOptions();
  });
}

// Combat options
function showCombatOptions() {
  typeText(`Scene: ${scenes[curSceneIndex].name}\nYou face the ${enemy.name}.`, 20, () => {
    options.innerHTML = `
      <button onclick="doAction('armor')">Pick up Armor</button>
      <button onclick="doAction('potion')">Use Potion</button>
      <button onclick="doAction('fight')">Fight</button>
    `;
  });
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

// Enemy's turn
function enemyTurn(prevText) {
  const dmg = Math.max(0, Math.floor(Math.random() * enemy.strength) + 3 - player.armor);
  player.health -= dmg;
  player.armor = Math.max(0, player.armor - dmg);
  updateStats();
  typeText(`${prevText}\n${enemy.name} hits you for ${dmg}.`, 20, showCombatOptions);
  checkPlayerDeath();
}

// Check if player is dead
function checkPlayerDeath() {
  if (player.health <= 0) {
    typeText("You've been defeated... Game over.");
    options.innerHTML = '';
  }
}

// End of battle
function endBattle(prevText) {
  typeText(`${prevText}\nYou've defeated ${enemy.name}!`, () => {
    curSceneIndex++;
    if (curSceneIndex < scenes.length) {
      loadScene();
    } else {
      typeText("Congratulations! All demons defeated.");
      options.innerHTML = '';
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
