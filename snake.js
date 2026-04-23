const canvas = document.getElementById('game_container');
const ctx = canvas.getContext('2d');

const config = {
  tiles: 30,
  framesPerSecond: 30,
  powerupSpawnVelocityMin: 15,
  powerupSpawnChance: 0.001,
  colors: {
    black: '#333',
    grey: 'grey',
    white: 'white',
    snake: 'lightgreen',
    head: 'yellow',
    food: 'red',
    power: 'blue'
  },
  directions: {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowRight: [1, 0],
    ArrowLeft: [-1, 0]
  }
};

const state = {
  forceUpdate: false,
  frame: 0,
  tileSize: 0,
  snake: [
    [0, 0],
    [1, 0],
    [2, 0]
  ],
  running: null,
  gameOver: false,
  direction: config.directions.ArrowRight,
  velocity: 1,
  food: [],
  powerup: []
};

function samePos(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function toKey(pos) {
  return `${pos[0]},${pos[1]}`;
}

function drawGrid() {
  rect(0, 0, canvas.width, canvas.height, config.colors.black);

  ctx.beginPath();

  for (let i = 0; i <= config.tiles; i++) {
    const x = i * state.tileSize;
    ctx.strokeStyle = config.colors.grey;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.moveTo(0, x);
    ctx.lineTo(canvas.width, x);
  }
  ctx.stroke();
}

function rect(x, y, sx, sy, color) {
  ctx.beginPath();
  ctx.rect(x, y, sx, sy);
  ctx.fillStyle = color;
  ctx.fill();
}

function setListeners() {
  document.addEventListener('keydown', controls);
}

function isOppositeDirection(nextDirection) {
  return state.direction[0] + nextDirection[0] === 0 && state.direction[1] + nextDirection[1] === 0;
}

function controls(event) {
  const nextDirection = config.directions[event.key];
  if (!nextDirection || isOppositeDirection(nextDirection)) {
    return;
  }

  state.forceUpdate = true;
  state.direction = nextDirection;
}

function drawSnake() {
  for (let i = 0; i < state.snake.length; i++) {
    const piece = state.snake[i];
    rect(piece[0] * state.tileSize, piece[1] * state.tileSize, state.tileSize, state.tileSize, config.colors.snake);
  }

  const head = state.snake[state.snake.length - 1];
  rect(head[0] * state.tileSize, head[1] * state.tileSize, state.tileSize, state.tileSize, config.colors.head);
}

function drawFood() {
  for (let i = 0; i < state.food.length; i++) {
    const item = state.food[i];
    rect(item[0] * state.tileSize, item[1] * state.tileSize, state.tileSize, state.tileSize, config.colors.food);
  }
}

function drawPowerup() {
  for (let i = 0; i < state.powerup.length; i++) {
    const item = state.powerup[i];
    rect(item[0] * state.tileSize, item[1] * state.tileSize, state.tileSize, state.tileSize, config.colors.power);
  }
}

function computeNextHead() {
  const last = state.snake[state.snake.length - 1];
  return [last[0] + state.direction[0], last[1] + state.direction[1]];
}

function wrapPosition(pos) {
  const border = config.tiles - 1;

  if (pos[0] < 0) {
    pos[0] = border;
  } else if (pos[0] > border) {
    pos[0] = 0;
  }

  if (pos[1] < 0) {
    pos[1] = border;
  } else if (pos[1] > border) {
    pos[1] = 0;
  }

  return pos;
}

function handleFoodCollision(head) {
  for (let i = 0; i < state.food.length; i++) {
    if (!samePos(head, state.food[i])) {
      continue;
    }

    state.velocity += 2;
    state.food.splice(i, 1);
    state.food.push(randomFood());
    return true;
  }

  return false;
}

function handlePowerCollision(head) {
  for (let i = 0; i < state.powerup.length; i++) {
    if (!samePos(head, state.powerup[i])) {
      continue;
    }

    state.powerup.splice(i, 1);
    return true;
  }

  return false;
}

function handleSelfCollision(head) {
  const headKey = toKey(head);
  for (let i = 0; i < state.snake.length - 1; i++) {
    if (headKey === toKey(state.snake[i])) {
      return true;
    }
  }

  return false;
}

function advanceSnake() {
  if (state.gameOver) {
    return;
  }

  const head = wrapPosition(computeNextHead());
  state.snake.push(head);

  if (!handleFoodCollision(head)) {
    state.snake.shift();
  }

  if (handleSelfCollision(head)) {
    state.gameOver = true;
    stopGame();
    return;
  }

  if (handlePowerCollision(head)) {
    state.velocity = Math.ceil(state.velocity / 2);
  }

  if (
    state.powerup.length === 0 &&
    state.velocity > config.powerupSpawnVelocityMin &&
    Math.random() < config.powerupSpawnChance
  ) {
    state.powerup.push(randomPower());
  }
}

function stopGame() {
  if (state.running !== null) {
    clearInterval(state.running);
    state.running = null;
  }
}

function randomFood() {
  const foodX = Math.floor(Math.random() * config.tiles);
  const foodY = Math.floor(Math.random() * config.tiles);
  const foodPos = [foodX, foodY];

  for (let i = 0; i < state.snake.length; i++) {
    if (samePos(state.snake[i], foodPos)) {
      return randomFood();
    }
  }

  return foodPos;
}

function randomPower() {
  return randomFood();
}

function init() {
  state.tileSize = canvas.width / config.tiles;
  state.food = [randomFood()];
  setListeners();
  state.running = setInterval(updateGame, 1000 / config.framesPerSecond);
}

window.addEventListener('load', init);

function updateGame() {
  state.frame += 1;
  drawGrid();
  drawSnake();
  drawFood();
  drawPowerup();

  if (
    state.forceUpdate ||
    state.frame % Math.ceil(config.framesPerSecond / state.velocity) === 0
  ) {
    state.forceUpdate = false;
    advanceSnake();
  }
}
