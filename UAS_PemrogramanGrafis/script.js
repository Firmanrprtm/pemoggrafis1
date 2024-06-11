const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = 800;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const BALL_RADIUS = 10;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const BRICK_ROWS = 5;
const BRICK_COLUMNS = 8;
const BRICK_WIDTH = WIDTH / BRICK_COLUMNS - 10;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const PADDLE_Y_OFFSET = 30;

let ball = {
    x: WIDTH / 2,
    y: HEIGHT - 40,
    dx: 2,
    dy: -2
};

let paddle = {
    x: WIDTH / 2 - PADDLE_WIDTH / 2,
    y: HEIGHT - PADDLE_Y_OFFSET,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
};

let bricks = [];
for (let r = 0; r < BRICK_ROWS; r++) {
    bricks[r] = [];
    for (let c = 0; c < BRICK_COLUMNS; c++) {
        bricks[r][c] = { x: 0, y: 0, status: 1 };
    }
}

canvas.addEventListener('mousemove', (e) => {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < WIDTH) {
        paddle.x = relativeX - paddle.width / 2;
    }
});

canvas.style.cursor = "none"; // Menghilangkan cursor

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let r = 0; r < BRICK_ROWS; r++) {
        for (let c = 0; c < BRICK_COLUMNS; c++) {
            if (bricks[r][c].status == 1) {
                let brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_PADDING;
                let brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_PADDING;
                bricks[r][c].x = brickX;
                bricks[r][c].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                ctx.fillStyle = "#f00";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off the walls
    if (ball.x + BALL_RADIUS > WIDTH || ball.x - BALL_RADIUS < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - BALL_RADIUS < 0) {
        ball.dy = -ball.dy;
    }

    // Bounce off the paddle
    if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + BALL_RADIUS > paddle.y
    ) {
        ball.dy = -ball.dy;
    }

    // Check for brick collision
    for (let r = 0; r < BRICK_ROWS; r++) {
        for (let c = 0; c < BRICK_COLUMNS; c++) {
            let brick = bricks[r][c];
            if (brick.status == 1) {
                if (
                    ball.x > brick.x &&
                    ball.x < brick.x + BRICK_WIDTH &&
                    ball.y > brick.y &&
                    ball.y < brick.y + BRICK_HEIGHT
                ) {
                    ball.dy = -ball.dy;
                    brick.status = 0;
                    // Increase score when hitting a brick
                    score++;
                }
            }
        }
    }

    // Reset the ball if it goes off the bottom
    if (ball.y + BALL_RADIUS > HEIGHT) {
        gameOver();
    }
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBall();
    drawPaddle();
    drawBricks();
}

function update() {
    moveBall();
    draw();
    requestAnimationFrame(update);
}

function gameOver() {
    alert("Game Over! Your score: " + score);
    document.location.reload();
}

let score = 0;
update();
