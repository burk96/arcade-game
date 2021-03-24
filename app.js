let gridX = 20;
let gridY = 30;
let fps = 2;
let clock;
let snake;

// initial state
let gameState = {
  canvas: buildCanvas(gridX, gridY),
  isRunning: false,
};

function buildCanvas(x, y) {
  let column = [];
  let canvas = [];
  for (let i = 0; i < x; i++) {
    column.push("");
  }

  for (let i = 0; i < y; i++) {
    canvas.push(column);
  }

  return canvas;
}

function renderState() {
  const canvasElement = $("#canvas");
  canvasElement.empty();

  gameState.canvas.forEach(function (row, rowIndex) {
    row.forEach(function (segment, segmentIndex) {
      const segmentElement = $(
        `<div class="segment" data-x="${segmentIndex}" data-y="${rowIndex}"></div>`
      );
      canvasElement.append(segmentElement);
    });
  });
}

function buildSnake() {
  $(".segment").removeClass("snake");
  const snakeHead = snake.body[0];
  const snakeHeadX = snakeHead[0];
  const snakeHeadY = snakeHead[1];

  const newSnakeHead = [
    snakeHeadX + snake.nextDirection[0],
    snakeHeadY + snake.nextDirection[1],
  ];

  snake.body.unshift(newSnakeHead);
  snake.body.pop();

  snake.body.forEach(function (coordinates) {
    const coordinateX = coordinates[0];
    const coordinateY = coordinates[1];

    const segmentElement = $(
      `[data-x="${coordinateX}"][data-y="${coordinateY}"]`
    );
    segmentElement.addClass("snake");
  });
}

function dropFood(foodType = "apple") {
  let foodX = Math.floor(Math.random() * gridX);
  let foodY = Math.floor(Math.random() * gridY);
  let food = [foodX, foodY];

  const foodElement = $(`[data-x="${foodX}"][data-y="${foodY}"]`);
  foodElement.addClass(`${foodType}`);
}

function collisionDetect() {
  const snakeHead = snake.body[0];

  //checks if we go out of bounds
  if (
    snakeHead[0] < 0 ||
    snakeHead[0] >= gridX ||
    snakeHead[1] < 0 ||
    snakeHead[1] >= gridY
  ) {
    gameOver("Snake left gameboard!");
  }

  //detects if the snake head is touching the body
  snake.body.forEach(function (coordinates, coordinateIndex) {
    if (
      coordinateIndex !== 0 &&
      JSON.stringify(coordinates) == JSON.stringify(snakeHead)
    ) {
      gameOver("Snake ate itself!");
    }
  });
}

function resetSnake() {
  snake = {
    body: [
      [10, 5],
      [10, 6],
      [10, 7],
      [10, 8],
    ],
    nextDirection: [0, 1],
  };
}

function gameOver(reason) {
  let score = snake.body.length - 4;
  alert("Game Over!\n" + reason + "\nYour snake grew " + score + " squares");
  stopGame();
  buildInitialState();
}

function buildInitialState() {
  resetSnake();
  renderState();
  buildSnake();
  dropFood();
}

// refresh the screen in an interval
function tick() {
  buildSnake();
  collisionDetect();
}

function startGame() {
  clock = setInterval(tick, 1000 / fps); //default is 30
  $(".start-button").text("Stop");
  $(".start-button").css({ "background-color": "red" });
  gameState.isRunning = true;
}

function stopGame() {
  clearInterval(clock);
  $(".start-button").text("Start");
  $(".start-button").css({ "background-color": "green" });
  gameState.isRunning = false;
}

function setFPS(desiredFPS) {
  fps = desiredFPS;
  if (gameState.isRunning) {
    stopGame();
    startGame();
  }
}

$(".start-button").click(function (event) {
  event.preventDefault();
  gameState.isRunning ? stopGame() : startGame();
});

$(window).on("keydown", function (event) {
  // here you might read which key was pressed and update the state accordingly
  switch (event.which) {
    case 37:
      //left
      if (gameState.isRunning) {
        snake.nextDirection = [-1, 0];
      }
      break;
    case 38:
      //up
      if (gameState.isRunning) {
        snake.nextDirection = [0, -1];
      }
      break;
    case 39:
      //right
      if (gameState.isRunning) {
        snake.nextDirection = [1, 0];
      }
      break;
    case 40:
      //down
      if (gameState.isRunning) {
        snake.nextDirection = [0, 1];
      }
      break;
    case 32:
      //space to start/stop
      gameState.isRunning ? stopGame() : startGame();
      break;
    default:
      break;
  }
});

buildInitialState();
