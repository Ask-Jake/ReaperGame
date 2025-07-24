// DOM Elements
const story = document.getElementById('story');
const input = document.getElementById('input');
const options = document.getElementById('options');
const healthEl = document.getElementById('health');
const armorEl = document.getElementById('armor');
const enemyNameEl = document.getElementById('enemy-name');
const enemyHealthEl = document.getElementById('enemy-health');
const sceneImg = document.getElementById('scene-img');
const bgMusic = document.getElementById('bg-music');

// Player & Enemy setup
let player = { name: '', health: 100, armor: 0, strength: 10 };
let enemy = null;
let curSceneIndex = 0;

// Scenes configuration
const scenes = [
  {
    name: 'Temple',
    img: 'temple.png',
    music: 'temple.mp3',
    enemy: { name: 'Demon Boss', health: 50, strength: 8 },
    terrainDescription:
      "SCENE 1: TEMPLE – The camera pans over a foreboding temple in the depths of Hell.\n" +
      "The walls are made of charred obsidian, and glowing red symbols burn into the stone.\n" +
      "Flames flicker in braziers, casting macabre shadows across broken statues of demonic figures" +
      "The air is thick with sulfuric smoke, and the only sounds are distant screams of damned souls echoing through the dark halls.\n" +
      "A feeling of malevolent power seems to suffuse the very air",
    introStory:
      "The supernatural society was a place of fear and danger.\n" +
      "It was filled with powerful and malevolent demons, dark magic, n" +
      "and a rigid hierarchy where the demons held absolute power over the grim reapers.\n" +
      "The grim reapers were forced to do the bidding of the demons, which included killing humans to reap their souls.\n" +
      "This violated the natural order of life and caused many of the reapers to want freedom and to fight for it, but only one would act.\n",
    dialogue: (name) =>
      '\n${name} was the first to take a stand against the demons and challenge their authority.\n` +
      `You have always been an outcast amongst the reapers, with none of them understanding` +
      `or too scared to try and understand your wish for freedom, and going against the will of the demons.\n` +
      `You were teased and mocked by the other reapers, but you knew deep down that you were right and were determined to make a stand.\n\n` +

      `You began a rebellion, traveling to different parts of the demon society, n` +
      `Recruiting those who wanted freedom from the demons' cruel rule. You fought many battles, n` +
      `Sustaining heavy losses, but eventually your numbers grew and became a powerful force.\n\n` +

      `This force grew until it was noticed by the Demon CEO, who sent his apprentice to warn the Demon Boss` +
      `Once he heard of this, the Demon Boss gathered a group of lower demons and went to the temple to confront you` +

      `As he arrived, you met him head-on. The battle begins!\n\n` +
      `${name}: Demon Boss, your time has come. You've caused too much suffering` +
      `Demon Boss: Ha! Foolish reaper. Have you ever stopped to consider what it means to be a demon?\n` +
      `To revel in the pain and suffering of others?\n\n` +

      `${name}: I understand power, but also responsibility. I won’t let you continue this.\n\n` +
      `Demon Boss: You can try, ${name}. But I won't go down without a fight...\n\n` +
      `The Demon Boss lunges with claws, but your scythe meets his fury...\n`
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

// Start Game button
function startGame() {
  player.name = input.value.trim() || 'Reaper';
  document.getElementById('input-container').style.display = 'none';
  document.getElementById('intro-img').style.display = 'none';
  sceneImg.style.display = 'block';
  loadScene();
}

// Load current scene
function loadScene() {
  const scene = scenes[curSceneIndex];
  sceneImg.src = scene.img;
  bgMusic.src = scene.music;
  bgMusic.play();

  enemy = { ...scene.enemy };
  updateStats();

  // Show terrain, then story, then dialogue, then combat
  typeText(scene.terrainDescription, 30, () => {
    setTimeout(() => {
      typeText(scene.introStory, 30, () => {
        setTimeout(() => {
          typeText(scene.dialogue(player.name), 30, showCombatOptions);
        }, 1000);
      });
    }, 1000);
  });
}

// Combat Options
function showCombatOptions() {
  options.innerHTML = `
    <button onclick="doAction('armor')">Pick up Armor</button>
    <button onclick="doAction('potion')">Use Potion</button>
    <button onclick="doAction('fight')">Fight</button>
  `;
}

// Player Actions
function doAction(action) {
  let text = '';
  const damage = Math.floor(Math.random() * player.strength) + 5;

  if (action === 'armor') {
    player. armor += 5;
    text = `${player.name} picks up armor (+5).`;
  } else if (action === 'potion') {
    player.health = Math.min(player.health + 20, 100);
    text = `${player.name} uses a potion (+20 HP).`;
  } else if (action === 'fight') {
    enemy.health -= damage;
    text = `${player.name} hits ${enemy.name} for ${damage} damage.`;
  }

  updateStats();

  if (action !== 'fight') {
    enemyTurn(text);
  } else if (enemy.health > 0) {
    enemyTurn(text);
  } else {
    endBattle(text);
  }
}

// Enemy Turn
function enemyTurn(prevText) {
  const damage = Math.max(0, Math.floor(Math.random() * enemy.strength) + 3 - player.armor);
  player.health -= damage;
  player.armor = Math.max(0, player.armor - damage);
  updateStats();
  typeText(`${prevText}\n${enemy.name} hits you for ${damage}.`, showCombatOptions);
  checkPlayerDeath();
}

// Update UI stats
function updateStats() {
  healthEl.textContent = player.health;
  armorEl.textContent = player.armor;
  enemyNameEl.textContent = enemy? enemy.name: '';
  enemyHealthEl.textContent = enemy? enemy.health: '';
}

// End of Battle
function endBattle(prevText) {
  typeText(`${prevText}\nYou've defeated ${enemy.name}!`, () => {
    curSceneIndex++;
    if (curSceneIndex < scenes.length) loadScene();
    else typeText("Congratulations! All demons defeated.");
  });
}

// Game Over
function checkPlayerDeath() {
  if (player.health <= 0) {
    typeText("You've been defeated... Game over.");
    options.innerHTML = '';
  }
}
