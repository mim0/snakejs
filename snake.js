const canv = document.getElementById('game_container');
const ctx = canv.getContext('2d');

const colors = {
  black: '#333',
  grey: 'grey',
  white: 'white',
  snake: 'lightgreen',
  head: 'yellow',
  food: 'red',
  power: 'blue'
};

const dirs = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowRight: [1, 0],
  ArrowLeft: [-1, 0]
};

let forceUpdate = false;

const tiles = 30;
let gridDist = canv.width / tiles;

let frame = 0;
const frames_per_second = 30;

let snake = [
  [0, 0],
  [1, 0],
  [2, 0]
];

let running = null;

let direction = dirs.ArrowRight;
let velocity = 1;

let food = [randomFood()];

let powerup = [];

window.onload = init();

function drawGrid() {
  rect(0, 0, canv.width, canv.height, colors.black);

  ctx.beginPath();

  let x = 0;
  for (var i = 0; i <= tiles; i++) {
    ctx.strokeStyle = colors.grey;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canv.height);
    ctx.moveTo(0, x);
    ctx.lineTo(canv.width, x);
    x = gridDist * i;
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

function controls(event) {
  if (!(event.key === 'ArrowUp' && (direction[0] === dirs.ArrowDown[0] && direction[1] === dirs.ArrowDown[1])) &&
    !(event.key === 'ArrowDown' && (direction[0] === dirs.ArrowUp[0] && direction[1] === dirs.ArrowUp[1])) &&
    !(event.key === 'ArrowLeft' && (direction[0] === dirs.ArrowRight[0] && direction[1] === dirs.ArrowRight[1])) &&
    !(event.key === 'ArrowRight' && (direction[0] === dirs.ArrowLeft[0] && direction[1] === dirs.ArrowLeft[1]))
  ) {
    forceUpdate = true;
    direction = dirs[event.key] || direction;
  }
}

function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    rect(snake[i][0] * gridDist, snake[i][1] * gridDist, gridDist, gridDist, colors.snake);
  }
  rect(snake[snake.length -1][0] * gridDist, snake[snake.length -1][1] * gridDist, gridDist, gridDist, colors.head);
}

function drawFood() {
  for (var i = 0; i < food.length; i++) {
    rect(food[i][0] * gridDist, food[i][1] * gridDist, gridDist, gridDist, colors.food);
  }
}

function drawPowerup() {

  for (let i = 0; i < powerup.length; i++) {
    rect(powerup[i][0] * gridDist, powerup[i][1] * gridDist, gridDist, gridDist, colors.power);
  }
}

function eatsFood(head) {
  let eats = false;
  for (var i = 0; i < food.length; i++) {
    if (head[0] === food[i][0] && head[1] === food[i][1]) {
      velocity += 2;
      food.splice(i, 1);
      food.push(randomFood());
      eats = true;
      break;
    }
  }
  return eats;
}

function eatsPower(head) {
  let eats = false;
  for (let i = 0; i < powerup.length; i++) {
    if (head[0] === powerup[i][0] && head[1] === powerup[i][1]) {
      powerup.splice(i, 1);
      eats = true;
      break;
    }
  }
  return eats;
}

function eatsItself(head) {
  let eats = false;
  for (var i = 0; i < snake.length - 1; i++) {
    if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
      velocity = 0;
      eats = true;
      break;
    }
  }
  return eats;
}

function updateSnake() {
  let shouldShift = true;
  let last = snake[snake.length - 1];
  let head = [last[0] + direction[0], last[1] + direction[1]];

  let border = tiles - 1;

  if (head[0] < 0) {
    head[0] = border;
  } else if (head[0] > border) {
    head[0] = 0;
  }

  if (head[1] < 0) {
    head[1] = border;
  } else if (head[1] > border) {
    head[1] = 0;
  }

  snake.push(head);

  if (!eatsFood(head)) {
    snake.shift();
  }

  if (eatsItself(head)) {
    stopGame();
  }

  if (eatsPower(head)) {
    velocity = Math.ceil(velocity / 2);
  }

  if (powerup.length === 0 && velocity > 15 && Math.random() < 0.001) {
    powerup.push(randomPower());
  }
}

function stopGame() {
  clearInterval(running);
}

function randomFood() {
  let food_x = Math.floor(Math.random() * tiles);
  let food_y = Math.floor(Math.random() * tiles);

  for (var i = 0; i < snake.length; i++) {
    if (snake[i][0] === food_x && snake[i][1] === food_y) {
      return randomFood();
    }
  }
  return [food_x, food_y];
}

function randomPower() {
  let pos = randomFood();

  return pos;
}

function init() {
  setListeners();
  running = setInterval(updateGame, 1000 / frames_per_second);
}

function updateGame() {
  frame += 1;
  drawGrid();
  drawSnake();
  drawFood();
  drawPowerup();

  if (forceUpdate || frame % Math.ceil(frames_per_second / velocity) === 0) {
    forceUpdate = false;
    updateSnake();
  }
}
