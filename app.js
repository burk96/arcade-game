let gridX = 20;
let gridY = 30;
let canvasGrid = buildCanvas(gridX, gridY);

// initial state
let gameState = {
  canvas: canvasGrid,
};

let snake = {
  body: [
    [10, 5],
    [10, 6],
    [10, 7],
    [10, 8], //Made it unusually long for debugging
    [10, 9],
    [10, 10],
    [10, 11],
    [10, 12],
    [10, 13],
  ],
  nextDirection: [0, 0],
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

function buildInitialState() {
  renderState();
  buildSnake();
}

// render the state
function renderState() {
  const canvasElement = $("#canvas");
  canvasElement.empty();

  gameState.canvas.forEach(function (row, rowIndex) {
    row.forEach(function (segment, segmentIndex) {
      const segmentElement = $(
        `<div class="segment" data-x="${rowIndex}" data-y="${segmentIndex}"></div>`
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

//Maybe move logic to here
function collisionDetect() {
  const snakeHead = snake.body[0];

  //checks if we go out of bounds
  if (
    snakeHead[0] < 0 ||
    snakeHead[0] >= gridY ||
    snakeHead[1] < 0 ||
    snakeHead[1] >= gridX
  ) {
    gameOver("Snake left gameboard!");
  }

  //detects if the snake head is touching the body
  snake.body.slice(1).forEach(function (coordinates) {
    if (coordinates == snakeHead) {
      gameOver("Snake ate itself!");
    }
  });
}

function gameOver(reason) {
  let score = snake.body.length - 4
  alert("Game Over!\n" + reason + "\nYour snake grew " + score + " squares" );
  snake.body = [
    [10, 5],
    [10, 6],
    [10, 7],
    [10, 8], //Made it unusually long for debugging
    [10, 9],
    [10, 10],
    [10, 11],
    [10, 12],
    [10, 13],
  ];
  snake.nextDirection = [0, 0];
}

// listeners
function onBoardClick() {
  // update state, maybe with another dozen or so helper functions...

  renderState(); // show the user the new state
}

$(".board").on("click", onBoardClick); // etc

// refresh the screen in an interval
function tick() {
  // this is an incremental change that happens to the state every time you update...

  buildSnake();
  collisionDetect();
}

setInterval(tick, 1000 / 2); // as close to 30 frames per second as possible

$(window).on("keydown", function (event) {
  // here you might read which key was pressed and update the state accordingly
  switch (event.which) {
    case 37:
      //left
      snake.nextDirection = [0, -1];
      break;
    case 38:
      //up
      snake.nextDirection = [-1, 0];
      break;
    case 39:
      //right
      snake.nextDirection = [0, 1];
      break;
    case 40:
      //down
      snake.nextDirection = [1, 0];
      break;
    case 32:
      //space to pause
      snake.nextDirection = [0, 0];
      break;
    default:
      break;
  }
});

buildInitialState();
