const GAMESIZE = 600;
const UNIT = 40;
const canvas = document.getElementById("canvas");
canvas.width = canvas.height = GAMESIZE;
const ctx = canvas.getContext('2d');

const BACKGROUND_COLOR = 'black';
const SNAKE_COLOR = 'orange';
const HEAD_COLOR = 'red';
const FOOD_COLOR = 'blue';

const maxLevel = 7, minLevel = 1;

var HIGH_SCORE = window.localStorage.getItem("highScore") || '0';
var TOP_PLAYER = window.localStorage.getItem("topPlayer") || 'SyHehe';

const LEFT = 37,
      UP = 38,
      RIGHT = 39,
      DOWN = 40;

class Vector{
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vt2) {
    this.x += vt2.x;
    this.y += vt2.y;
  }

  Sub(vt2) {
    this.x -= vt2.x;
    this.y -= vt2.y;
  }

  Assign(vt2) {
    this.x = vt2.x;
    this.y = vt2.y;
  }

  cmp(vt2) {
    return (this.x == vt2.x && this.y == vt2.y);
  }
}

class snake{
  constructor() {
    this.body = [new Vector(3, 0), 
                new Vector(2, 0),
                new Vector(1, 0)];
    this.head = this.body[0];

    this.curDirection = new Vector(1, 0);

    this.snakeScore = 0;

    this.eatAudio = new Audio("../Sound/Nope.mp3");
    this.sadAudio = new Audio("../Sound/sad.mp3");
  }

  draw(){
    for (let i=1; i<this.body.length; i++) {
      drawRectOnboard(this.body[i], SNAKE_COLOR);
    }
    drawRectOnboard(this.body[0], HEAD_COLOR);
  }

  size() {
    return this.body.length;
  }
  
  move () {
    drawRectOnboard(this.body[this.size()-1], BACKGROUND_COLOR);
    for (let i = this.body.length-1; i>0; i--) {
      this.body[i].Assign(this.body[i-1]);
    }
    this.body[0].add(this.curDirection);

    this.handleBound();
    this.draw();
  }

  //true khi dau con ran cham thuc an
  checkEat(food) {
    return this.body[0].cmp(food.pos);
  }

  //an 1 con moi
  eatAndUpdate() {
    this.eatAudio.play();
    let newPart = new Vector(0,0);
    newPart.Assign(this.body[this.size()-1]);
    newPart.Sub(this.body[this.size()-2]);
    newPart.add(this.body[this.size()-1]);

    this.body.push(newPart);
    this.draw();  
  }

  handleBound() {
    if (this.body[0].x < 0){
      this.body[0].x = GAMESIZE/UNIT-1;
    }
    if (this.body[0].x > GAMESIZE/UNIT-1){
      this.body[0].x = 0;
    }
    if (this.body[0].y < 0){
      this.body[0].y = GAMESIZE/UNIT-1;
    }
    if (this.body[0].y > GAMESIZE/UNIT-1){
      this.body[0].y = 0;
    }
  }

  //true la chet, false la song
  checkDead() {
    for (let i=1; i<this.size(); i++) {
      if (this.body[0].cmp(this.body[i]))
      {
        this.sadAudio.play();
        return true;
      }
    }
    return false;
  }
}

class Food{
  constructor(vt2) {
    this.pos = new Vector();
    this.pos.Assign(vt2);
  }

  draw() {
    drawRectOnboard(this.pos, FOOD_COLOR);
  }

  getRandomPos() {
    let x = Math.floor(Math.round(Math.random()*(GAMESIZE/UNIT-1)));
    let y = Math.floor(Math.round(Math.random()*(GAMESIZE/UNIT-1)));
    return new Vector(x, y);
  }

  getNewFood(arr) {
    let check = false;
    while(check==false){
      this.pos.Assign(this.getRandomPos());
      for (let i=0; i<arr.length; i++)
        if (this.pos.cmp(arr[i])) {
          check = true;
          break;
        }
      check = check==true?false:true;
    }
    this.draw();
  }
}

class Game{
  constructor() {
    this.curLevel = 1;
    this.player = new snake();
    this.food = new Food(new Vector(5,5));
    this.myInterval;
    this.gameDelay = 400-this.curLevel*50;
    this.playerName = "";

    playDialog.showModal();
    this.drawBoardAndSnake();
    this.showScoreAndTop();
  }

  run() {
      playDialog.close();
      this.setTimer();
  }

  showScoreAndTop() {
    if (parseInt(HIGH_SCORE) == NaN) {
      HIGH_SCORE = '0';
    }
    if (typeof TOP_PLAYER !== 'string') {
      TOP_PLAYER = 'NONE';
    }
    document.getElementById("highScore").innerHTML = HIGH_SCORE;
    document.getElementById("topPlayer").innerHTML = TOP_PLAYER;
  }

  //ve bang
  drawBoardAndSnake() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, GAMESIZE, GAMESIZE);

    this.player.draw();
    this.food.draw();
  }

  //lap lai ham myTimer moi gameDelay thoi gian
  setTimer() {
    this.myInterval = setInterval(myTimer, this.gameDelay);
  }

  updateGameDelay() {
    this.gameDelay = 400-this.curLevel*50;
  }

}

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

document.onkeydown = function(e) {
  switch (e.keyCode) {

    case LEFT:
      if (game.player.curDirection.cmp(new Vector(1, 0)))
        break;
      game.player.curDirection = new Vector(-1, 0);
      break;

    case UP:
      if (game.player.curDirection.cmp(new Vector(0, 1)))
        break;
      game.player.curDirection = new Vector(0, -1);
      break;

    case RIGHT:
      if (game.player.curDirection.cmp(new Vector(-1, 0)))
        break;
      game.player.curDirection = new Vector(1, 0);
      break;

    case DOWN:
      if (game.player.curDirection.cmp(new Vector(0, -1)))
        break;
      game.player.curDirection = new Vector(0, 1);
      break;

    default:
      break;
  }
}

document.getElementById('upLevelBtn').onclick = function(){
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

document.getElementById('downLevelBtn').onclick = function(){
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

document.getElementById('pauseBtn').onclick = function(){
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

document.getElementById('resetBtn').onclick = function(){
  window.location.reload();
};

document.getElementById('endGameBtn').onclick = function(){
  game.playerName = document.getElementById("gameoverInput").value;
  let regullar = /^\w{3,10}$/g;
  if(regullar.test(game.playerName)) {
    if (game.player.snakeScore == HIGH_SCORE)
      window.localStorage.setItem('topPlayer', game.playerName);
    window.location.reload();
  }
  else {
    document.getElementById("passwordHandle").innerHTML = "*Use 3-10 characters, no symbol or space.";
  }
};

document.getElementById('playBtn').onclick = function(){
  game.run();
};

var game = new Game();