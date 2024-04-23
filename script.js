const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: 50,
  y: canvas.height - 50,
  width: 30,
  height: 30,
  color: "blue",
  isJumping: false,
  jumpHeight: 80,
  jumpPower: 3 // Mengurangi nilai jumpPower agar kecepatan jatuh lebih lambat
};

const obstacle = {
  x: canvas.width,
  y: canvas.height - 50,
  width: 30,
  height: 30,
  color: "yellow",
  speed: 3
};

let score = 0;
let isGameOver = false;

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacle() {
  ctx.fillStyle = obstacle.color;
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacle();
  drawScore();
}

function moveObstacle() {
  obstacle.x -= obstacle.speed;
  if (obstacle.x + obstacle.width < 0) {
    obstacle.x = canvas.width;
    score++;
  }
}

function checkCollision() {
  if (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  ) {
    isGameOver = true;
  }
}

function update() {
  if (!isGameOver) {
    moveObstacle();
    draw();
    if (player.isJumping) {
      if (player.y > canvas.height - 50 - player.jumpHeight) {
        player.y -= player.jumpPower;
      } else {
        player.isJumping = false;
      }
    } else if (player.y < canvas.height - 50) {
      player.y += player.jumpPower;
    }
    checkCollision();
    if (isGameOver) {
      clearInterval(gameTimerId);
      alert("Game Over! Your Score: " + score);
      location.reload();
    }
  }
}

const gameTimerId = setInterval(update, 20);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !player.isJumping) {
    player.isJumping = true;
  }
});
