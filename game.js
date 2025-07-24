const story = document.getElementById('story');
const input = document.getElementById('input');
const options = document.getElementById('options');

let playerName = "";

function typeText(text, delay = 25, callback = null) {
  let i = 0;
  story.innerHTML = "";
  function type() {
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

function startGame() {
  playerName = input.value.trim() || "Reaper";
  input.style.display = "none";
  document.querySelector('button').style.display = "none";
  const intro = `The supernatural society was a place of fear and danger.
It was filled with powerful and malevolent demons, dark magic,
and a rigid hierarchy where the demons held absolute power over the grim reapers.

${playerName} was the first to take a stand against the demons and challenge their authority.

You've always been an outcast among the reapers, mocked and misunderstood for your vision of freedom.
But deep down, you knew you were right. You began a rebellion...

Eventually, the Demon CEO took notice. The battle for the supernatural world begins now.`;
  typeText(intro, 25, showOptions);
}

function showOptions() {
  options.innerHTML = `
    <button onclick="choose('armor')">Pick up Armor</button>
    <button onclick="choose('potion')">Use Potion</button>
    <button onclick="choose('fight')">Fight</button>
  `;
}

function choose(action) {
  let result = "";
  switch(action) {
    case 'armor':
      result = `${playerName} picks up armor and prepares for battle.`;
      break;
    case 'potion':
      result = `${playerName} drinks a potion and regains strength.`;
      break;
    case 'fight':
      result = `${playerName} charges into battle, scythe blazing.`;
      break;
  }
  typeText(result, 25, showOptions);
}
