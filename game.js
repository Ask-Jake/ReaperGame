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
const introImg = document.getElementById('intro-img');

let player = { name: '', health: 100, armor: 0, strength: 10 };
let enemy = null;

const scenes = [
  {
    name: 'The Temple',
    img: 'temple.png',
    music: 'temple.mp3',
    enemy: { name: 'Demon Boss', health: 50, strength: 8 },
    description: `SCENE 1 TEMPLE:
The camera pans over a foreboding temple in the depths of Hell.
The walls are made of charred obsidian, and glowing red symbols burn into the stone.
Flames flicker in braziers, casting macabre shadows across broken statues of demonic figures.
The air is thick with sulfuric smoke, and the only sounds are distant screams of damned souls echoing through the dark halls.
A feeling of malevolent power seems to suffuse the very air.`
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
  document.getElementById('input-container').style.display = 'none';
  introImg.style.display = 'none';
  sceneImg.style.display = 'block';

  // Show intro storyline before first scene
  const intro = `
The supernatural society was a place of fear and danger.
It was filled with powerful and malevolent demons, dark magic,
and a rigid hierarchy where the demons held absolute power over the grim reapers.
The grim reapers were forced to do the bidding of the demons, which included killing humans to reap their souls.
This violated the natural order of life and caused many of the reapers to want freedom and to fight for it, but only one would act.

${player.name} was the first to take a stand against the demons and challenge their authority.
You have always been an outcast amongst the reapers, with none of them really understanding
or too scared to try and understand your wish for freedom and going against the will of the demons.
You were teased and mocked by the other reapers who did not join your cause,
but you knew deep down that you were right and were determined to make a stand.

They began a rebellion, traveling to different parts of the demon society
and recruiting those who wanted freedom from the demons' cruel rule.
They fought many battles, often sustaining heavy losses, but eventually their numbers grew.

This powerful force grew until it was noticed by the Demon CEO.
He sent his most trustworthy apprentice to deliver the news to the Demon Boss.
The Demon Boss gathered a horde of low-level demons and marched toward the demonic temple—
where he knew he would find ${player.name}.

Just as the Demon Boss approached the temple, a yell rang out from behind him.
The battle between the Grim Reaper and the Demon Boss was about to begin.

${player.name}: "Demon Boss, your time has come. You’ve caused too much suffering among the living. It's time to pay."

Demon Boss: "Hah! Grim Reaper, you always were a self-righteous fool.
Have you ever stopped to consider what it means to be a demon?"

${player.name}: "I understand our power, but I also understand the responsibility that comes with it.
I won't let you continue spreading darkness."

Demon Boss: "You can try, ${player.name}, but I won’t go down without a fight..."
`;

  typeText(intro, 25, () => {
    setTimeout(loadScene, 1000);
  });
}

// Load a scene
function loadScene() {
  const scene = scenes[curSceneIndex];
  sceneImg.src = scene.img;
  bgMusic.src = scene.music;
  bgMusic.play();

  enemy = Object.assign({}, scene.enemy);
  updateStats();

  typeText(`${scene.description}\n\nYou face the ${enemy.name}.`, showCombatOptions);
}

function showCombatOptions() {
  options.innerHTML = `
    <button onclick="doAction('armor')">Pick up Armor</button>
    <button onclick="doAction('potion')">Use Potion</button>
    <button onclick="doAction('fight')">Fight</button>
  `;
}

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
  if (enemy.health > 0) {
    enemyTurn(text);
  } else {
    endBattle(text);
  }
}

function enemyTurn(prevText) {
  const dmg = Math.max(0, Math.floor(Math.random() * enemy.strength) + 3 - player.armor);
  player.health -= dmg;
  player.armor = Math.max(0, player.armor - dmg);
  updateStats();
  typeText(`${prevText}\n${enemy.name} hits you for ${dmg}.`, showCombatOptions);
  checkPlayerDeath();
}

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

function updateStats() {
  healthEl.textContent = player.health;
  armorEl.textContent = player.armor;
  enemyNameEl.textContent = enemy? enemy.name: '';
  enemyHealthEl.textContent = enemy? enemy.health: '';
}

function checkPlayerDeath() {
  if (player.health <= 0) {
    typeText("You've been defeated... Game over.");
    options.innerHTML = '';
  }
}
