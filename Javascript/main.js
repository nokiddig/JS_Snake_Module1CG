const GAMESIZE = 600;
const UNIT = 40;
const canvas = document.getElementById("canvas");
canvas.width = canvas.height = GAMESIZE;
const ctx = canvas.getContext('2d');

const BACKGROUND_COLOR = 'black';
const SNAKE_COLOR = 'orange'
const HEAD_COLOR = 'red';
const FOOD_COLOR = 'blue'

var maxLevel = 7, minLevel = 1;

let LEFT = 37,
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

    this.playerScore = 0;

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

  update() {
    //an 1 con moi
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

  checkDead() {
    //true la chet, false la song
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

    playDialog.showModal();
    this.drawBackgrAndSnake();
  }

  updateGameDelay() {
    this.gameDelay = 400-this.curLevel*50;
  }

  run(){
    playDialog.close();
    this.setTimer();
  }

  drawBackgrAndSnake() {
    //ve bang
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, GAMESIZE, GAMESIZE);

    this.player.draw();
    this.food.draw();
  }

  setTimer() {
    //lap lai ham myTimer moi gameDelay thoi gian
    this.myInterval = setInterval(myTimer, this.gameDelay);
  }
}

function drawRectOnboard(vt, color) {
  ctx.fillStyle = color;
  ctx.fillRect(vt.x*UNIT, vt.y*UNIT, UNIT, UNIT);
  ctx.fillStyle = 'red';
  ctx.strokeRect(vt.x*UNIT, vt.y*UNIT, UNIT, UNIT);
}

function myTimer() {
  game.player.move();
  if (game.player.checkDead()) {
    clearInterval(game.myInterval);
    gameOverDialog.showModal();
  }

  if (game.player.checkEat(game.food)) {
    game.player.update();
    game.food.getNewFood(game.player.body);
    game.player.playerScore += Math.round(game.curLevel);
    document.getElementById("score").innerHTML = game.player.playerScore;
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
  window.location.reload();
};

document.getElementById('playBtn').onclick = function(){
  game.run();
};

var game = new Game();