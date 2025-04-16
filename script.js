const player = document.getElementById('player');
const game = document.getElementById('game');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('bestScore');
const gameOverScreen = document.getElementById('gameOverScreen');

let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
bestScoreEl.textContent = bestScore;

let obstacleSpeed = 4000;
let obstacleInterval;
let isGameOver = false;

document.addEventListener('keydown', function (e) {
  if ((e.code === 'ArrowUp' || e.code === 'Space') && !isGameOver) {
    jump();
  }
});

function jump() {
  if (!player.classList.contains('jump')) {
    player.classList.add('jump');
    setTimeout(() => {
      player.classList.remove('jump');
    }, 600);
  }
}

function createObstacle() {
  if (isGameOver) return;

  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.right = '-80px';
  game.appendChild(obstacle);

  let move = obstacle.animate([
    { right: '-80px' },
    { right: '100vw' }
  ], {
    duration: obstacleSpeed,
    easing: 'linear'
  });

  const checkCollision = setInterval(() => {
    if (isGameOver) {
      clearInterval(checkCollision);
      return;
    }

    const playerRect = player.getBoundingClientRect();
    const obsRect = obstacle.getBoundingClientRect();
    const buffer = 20;

    if (
      obsRect.left + buffer < playerRect.right - buffer &&
      obsRect.right - buffer > playerRect.left + buffer &&
      obsRect.bottom - buffer > playerRect.top + buffer &&
      obsRect.top + buffer < playerRect.bottom - buffer
    ) {
      gameOver();
      clearInterval(checkCollision);
    }
  }, 10);

  move.onfinish = () => {
    clearInterval(checkCollision);
    if (!isGameOver) {
      obstacle.remove();
      score += 10;
      scoreEl.textContent = score;

      // Speed up the game every 50 points
      if (score % 50 === 0 && obstacleSpeed > 1000) {
        obstacleSpeed -= 200;
      }
    }
  };
}

function startGame() {
  score = 0;
  obstacleSpeed = 4000;
  scoreEl.textContent = score;
  isGameOver = false;
  obstacleInterval = setInterval(createObstacle, 2000);
}

function gameOver() {
  isGameOver = true;
  clearInterval(obstacleInterval);
  gameOverScreen.classList.remove('hidden');

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
    bestScoreEl.textContent = bestScore;
  }
}

function restartGame() {
  gameOverScreen.classList.add('hidden');
  game.querySelectorAll('.obstacle').forEach(el => el.remove());
  startGame();
}

startGame();