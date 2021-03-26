let gridX = 20;
let gridY = 30;
let fps = 10;
let clock;
let snake;
let foodArray = [];
let grow = false;

// initial state
let gameState = {
  canvas: buildCanvas(gridX, gridY),
  isRunning: false,
  player: {
    name: "",
    score: 0,
  }
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

  // By default, grow is false, however eating food will set it to true
  if (!grow) {
    snake.body.pop();
  } else {
    grow = false;
  }

  snake.body.forEach(function (coordinates) {
    const coordinateX = coordinates[0];
    const coordinateY = coordinates[1];

    const segmentElement = $(
      `[data-x="${coordinateX}"][data-y="${coordinateY}"]`
    );
    segmentElement.addClass("snake");
  });
}

function createFood(foodType = "apple") {
  let foodX;
  let foodY;
  let foodElement;

  do {
    foodX = Math.floor(Math.random() * gridX);
    foodY = Math.floor(Math.random() * gridY);

    foodElement = $(`[data-x="${foodX}"][data-y="${foodY}"]`);
  } while (foodElement.hasClass("snake"));
  foodElement.addClass(`${foodType}`);

  let foodItem = {
    coordinates: [foodX, foodY],
    type: foodType,
  };
  foodArray.push(foodItem);
}

function removeFood(type) {
  // Finds the index of the Foodtype in the food array
  let index = foodArray
    .map(function (food) {
      return food.type;
    })
    .indexOf(type);

  let coordinates = foodArray[index].coordinates;

  let foodElement = $(
    `[data-x="${coordinates[0]}"][data-y="${coordinates[1]}"]`
  );

  foodElement.removeClass(type);
  foodArray.pop(index);
}

function collisionDetect() {
  const snakeHead = snake.body[0];

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

function outOfBoundsDetect() {
  const snakeHead = snake.body[0];

  if (
    snakeHead[0] < 0 ||
    snakeHead[0] >= gridX ||
    snakeHead[1] < 0 ||
    snakeHead[1] >= gridY
  ) {
    gameOver("Snake left gameboard!");
  }
}

function foodCheck() {
  // Checks to see if the snake has eaten food
  // Loops through food array and will check type if collision
  const snakeHead = snake.body[0];

  foodArray.forEach(function (food) {
    if (JSON.stringify(food.coordinates) === JSON.stringify(snakeHead)) {
      switch (food.type) {
        case "apple":
          removeFood("apple");
          createFood("apple");
          grow = true;
          gameState.player.score++;
          break;
        default:
          break;
      }
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

function resetFood() {
  foodArray = [];
}

function showScore() {
  let score = gameState.player.score;
  $(".player-score").text(score);
}

function gameOver(reason) {
  let score = gameState.player.score;
  alert("Game Over!\n" + reason + "\nYour snake grew " + score + " squares");
  gameState.player.score = 0;
  stopGame();
  buildInitialState();
}

function buildInitialState() {
  resetSnake();
  resetFood();
  renderState();
  buildSnake();
  createFood();
}

// refresh the screen in an interval
function tick() {
  buildSnake();
  collisionDetect();
  outOfBoundsDetect();
  foodCheck();
  showScore();
}

function startGame() {
  clock = setInterval(tick, 1000 / fps);
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

$(".difficulty-button").click(function (event) {
  event.preventDefault();
  if ($(this).hasClass("easy-mode")) {
    setFPS(5);
  } else if ($(this).hasClass("normal-mode")) {
    setFPS(10);
  } else if ($(this).hasClass("hard-mode")) {
    setFPS(20);
  }

  $(".difficulty-button").removeClass("selected");
  $(this).addClass("selected");
});

$(".start-button").click(function (event) {
  event.preventDefault();
  gameState.isRunning ? stopGame() : startGame();
  $(this).blur();
});

$(window).on("keydown", function (event) {
  // here you might read which key was pressed and update the state accordingly
  switch (event.which) {
    case 37:
      //left
      console.log("Case left button")
      if (gameState.isRunning && snake.nextDirection[0] !== 1) {
        snake.nextDirection = [-1, 0];
      }
      break;
    case 38:
      //up
      console.log("Case up button")
      if (gameState.isRunning && snake.nextDirection[1] !== 1) {
        snake.nextDirection = [0, -1];
      }
      break;
    case 39:
      //right
      console.log("Case right button")
      if (gameState.isRunning && snake.nextDirection[0] !== -1) {
        snake.nextDirection = [1, 0];
      }
      break;
    case 40:
      //down
      console.log("Case down button")
      if (gameState.isRunning && snake.nextDirection[1] !== -1) {
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
