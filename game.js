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
let curSceneIndex = 0;
let currentTypeId = 0;

// Scenes configuration
const scenes = [
  {
    name: 'Temple',
    img: 'scene1-temple.png',
    music: 'temple.mp3',
    enemy: { name: 'Demon Boss', health: 50, strength: 8 },
    description: `SCENE 1 – TEMPLE:
You are walking through the foreboding temple in the deepest depths of Hell.
The walls are made of charred obsidian, and glowing red symbols burn into the stone.
Flames flicker in braziers, casting macabre shadows across broken statues of demonic figures.
The air is thick with sulfuric smoke, and the only sounds are distant screams of damned souls echoing through the dark halls.
A feeling of malevolent power seems to suffuse the very air.`
  },
  {
    name: 'Forest',
    img: 'scene2-forest.png',
    music: 'forest.mp3',
    enemy: { name: 'Demon Supervisor', health: 80, strength: 12 },
    description: 'A misty forest full of corrupted creatures and twisted trees...'
  },
  {
    name: 'Metropolis',
    img: 'scene3-city.png',
    music: 'city.mp3',
    enemy: { name: 'Demon CEO', health: 150, strength: 20 },
    description: 'A towering city of infernal architecture, dominated by greed and control...'
  }
];

// Typewriter effect with interruption support
function typeText(text, delay = 30, callback) {
  currentTypeId++;
  const myId = currentTypeId;
  story.innerHTML = ''; // Clear any previous text
  let i = 0;

  function type() {
    if (myId !== currentTypeId) return; // Cancel old text if a new one starts
    if (i < text.length) {
      story.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, delay);
    } else if (callback) {
      callback();
    }
  }

  type();
}

// Intro text on page load
window.onload = function () {
  const introText = `
The supernatural society was a place of fear and danger.
It was filled with powerful and malevolent demons, dark magic,
and a rigid hierarchy where the demons held absolute power over the grim reapers.
The grim reapers were forced to do the bidding of the demons, which included killing humans to reap their souls.
This violated the natural order of life and caused many of the reapers to want freedom and to fight for it, but only one would act.

`;
  typeText(introText);
};

// Start game
function startGame() {
  currentTypeId++; // cancel any ongoing typewriter
  story.innerHTML = ''; // clear the intro story
  player.name = input.value.trim() || 'Reaper';
  document.getElementById('input-container').style.display = 'none';
  introImg.style.display = 'none';
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

  const sceneNarrative = `
${scene.description}

${player.name} was the first to take a stand against the demons and challenge their authority.
You have always been an outcast amongst the reapers, with none of them really understanding
or too scared to try and understand your wish for freedom and going against the will of the demons. You were teased and mocked by the other reapers who did not join your cause,
but you knew deep down that you were right and were determined to make a stand.

They began a rebellion, travelling to different parts of the demon society
and recruiting those who wanted freedom from the demons' cruel rule. They fought many battles,
often sustaining heavy losses, but eventually their numbers grew, and they became a powerful force.

This powerful force grew in numbers until the demon CEO had no choice but to notice it. He sent down his most trustworthy apprentice
to express the news to the demon boss. Once hearing of this, he amassed a group of
lower-level demons and headed to the demonic temple where he knew he would find ${player.name}.

Once the demon boss arrived, he was met with a yell from behind him right before he entered the temple. The first fight between the Grim Reaper and the Demon Boss began with the Grim Reaper summoning his scythe and the Demon Boss laughing at the challenge.

${player.name}: Demon Boss, your time has come. You have caused too much suffering and chaos amongst the living. It's time for you to pay the price.

Demon Boss: Ha-ha, Grim Reaper, you always were a self-righteous fool. Have you ever stopped to consider what it means to be a demon? To revel in the pain and suffering of others?

${player.name}: I understand the power that comes with our roles, but I also understand the responsibility that comes with it. I will not let you continue to spread darkness in the world.

Demon Boss: You can try, ${player.name}, but you know I won't go down without a fight.

The Reaper was steadfast and confident in his mission.
The Demon Boss began to attack with swipes of his claws,
but the Grim Reaper was able to block each attack with his scythe—except one—
Yet you managed to land a few blows of your own.
`;

  typeText(sceneNarrative, 30, showCombatOptions);
}

// Update stats
function updateStats() {
  healthEl.textContent = player.health;
  armorEl.textContent = player.armor;
  enemyNameEl.textContent = enemy.name;
  enemyHealthEl.textContent = enemy.health;
}

// Show combat options
function showCombatOptions() {
  options.innerHTML = `
    <button onclick="doAction('armor')">Pick up Armor</button>
    <button onclick="doAction('potion')">Use Potion</button>
    <button onclick="doAction('fight')">Fight</button>
  `;
}

// Handle actions
function doAction(act) {
  let text = '';
  const damage = Math.floor(Math.random() * player.strength) + 5;

  switch (act) {
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

  if (act !== 'fight') enemyTurn(text);
  else if (enemy.health > 0) enemyTurn(text);
  else endBattle(text);
}

// Enemy response
function enemyTurn(prevText) {
  let dmg = Math.floor(Math.random() * enemy.strength) + 3;
  let armorAbsorb = Math.min(dmg, player.armor);
  let healthDamage = dmg - armorAbsorb;

  player.armor -= armorAbsorb;
  player.health -= healthDamage;

  updateStats();

  typeText(
    `${prevText}\n${enemy.name} attacks! Damage: ${dmg} → Armor blocked: ${armorAbsorb}, HP lost: ${healthDamage}.`,
    showCombatOptions
  );

  checkPlayerDeath();
}

// Death check
function checkPlayerDeath() {
  if (player.health <= 0) {
    typeText(`You have been defeated by ${enemy.name}. Game Over.`);
    options.innerHTML = '';
  }
}

// End battle logic
function endBattle(prevText) {
  typeText(`${prevText}\nYou've defeated ${enemy.name}!`, () => {
    options.innerHTML = '';
    if (curSceneIndex < scenes.length - 1) {
      const btn = document.createElement('button');
      btn.textContent = 'Continue';
      btn.onclick = () => {
        curSceneIndex++;
        loadScene();
      };
      options.appendChild(btn);
    } else {
      typeText("Congratulations! You've defeated all the demons and restored balance!");
    }
  });
}
