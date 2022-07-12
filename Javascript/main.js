const GAMESIZE = 600;
const UNIT = 40;
const BACKGROUND_COLOR = 'black';
const SNAKE_COLOR = 'orange';
const HEAD_COLOR = 'red';
const FOOD_COLOR = 'blue';
const canvas = document.getElementById("canvas");
canvas.width = canvas.height = GAMESIZE;
const ctx = canvas.getContext('2d');

const maxLevel = 7, minLevel = 1;

let HIGH_SCORE = window.localStorage.getItem("highScore") || '0';
let TOP_PLAYER = window.localStorage.getItem("topPlayer") || 'SyHehe';

const LEFT = 37,
      UP = 38,
      RIGHT = 39,
      DOWN = 40;

function drawRectOnboard(vt, color) {
  ctx.fillStyle = color;
  ctx.fillRect(vt.x*UNIT, vt.y*UNIT, UNIT, UNIT);
  
  ctx.lineJoin = "round";	
  ctx.strokeStyle = BACKGROUND_COLOR;
  ctx.strokeRect(vt.x*UNIT, vt.y*UNIT, UNIT, UNIT);
}

function myTimer() {
  game.player.move();
  if (game.player.checkDead()) {
    clearInterval(game.myInterval);
    gameOverDialog.showModal();
  }

  if (game.player.checkEat(game.food)) {
    game.player.eatAndUpdate();
    game.food.getNewFood(game.player.body);
    game.player.snakeScore += Math.round(game.curLevel);
    document.getElementById("score").innerHTML = game.player.snakeScore;
  }

  if (game.player.snakeScore > parseInt(HIGH_SCORE)) {
    document.getElementById("highScore").innerHTML = game.player.snakeScore;
    HIGH_SCORE = game.player.snakeScore.toString();
    window.localStorage.setItem('highScore', HIGH_SCORE.toString());
  }
}

// ========= event =============== 
document.onkeydown = function(e) {
  switch (e.keyCode) {

    case LEFT:
      if (game.player.curDirection.compare(new Vector(1, 0)))
        break;
      game.player.curDirection = new Vector(-1, 0);
      break;

    case UP:
      if (game.player.curDirection.compare(new Vector(0, 1)))
        break;
      game.player.curDirection = new Vector(0, -1);
      break;

    case RIGHT:
      if (game.player.curDirection.compare(new Vector(-1, 0)))
        break;
      game.player.curDirection = new Vector(1, 0);
      break;

    case DOWN:
      if (game.player.curDirection.compare(new Vector(0, -1)))
        break;
      game.player.curDirection = new Vector(0, 1);
      break;

    default:
      break;
  }
}

document.getElementById('upLevelBtn').onclick = function() {
  if (maxLevel > game.curLevel) {
    document.getElementById('level').innerHTML ++;
    game.curLevel ++;
  }
  game.updateGameDelay();
  
  if (document.getElementById('pauseBtn').innerHTML == "Pause"){
    clearInterval(game.myInterval);
    game.setTimer();
  }
};

document.getElementById('downLevelBtn').onclick = function() {
  if (minLevel < game.curLevel) {
    document.getElementById('level').innerHTML --;
    game.curLevel --;
  }
  game.updateGameDelay();
  
  if (document.getElementById('pauseBtn').innerHTML == "Pause"){
    clearInterval(game.myInterval);
    game.setTimer();
  }
};

document.getElementById('pauseBtn').onclick = function() {
  let str = document.getElementById('pauseBtn').innerHTML;

  if (str == "Pause"){
    clearInterval(game.myInterval);
    document.getElementById('pauseBtn').innerHTML = "Continue";
  }
  
  if (str == "Continue"){
    game.setTimer();
    document.getElementById('pauseBtn').innerHTML = "Pause";
  }
};

document.getElementById('resetBtn').onclick = function() {
  window.location.reload();
};

document.getElementById('endGameBtn').onclick = function() {
  game.playerName = document.getElementById("gameoverInput").value;
  let regullar = /^\w{3,10}$/g;
  if(regullar.test(game.playerName)) {
    if (game.player.snakeScore == HIGH_SCORE)
      window.localStorage.setItem('topPlayer', game.playerName);
    window.location.reload();
  }
  else {
    document.getElementById("passwordHandle").innerHTML = 
    "*Use 3-10 characters, no symbol or space.";
  }
};

document.getElementById('playBtn').onclick = function() {
  game.run();
};
// ===============================

var game = new Game();