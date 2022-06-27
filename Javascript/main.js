const gameSize = 600;
const UNIT = 40;
const canvas = document.getElementById("canvas");
canvas.width = canvas.height = gameSize;
const ctx = canvas.getContext('2d');

const BACKGROUND_COLOR = 'black';
const SNAKE_COLOR = 'white'
const HEAD_COLOR = 'red';


ctx.fillStyle = BACKGROUND_COLOR;
ctx.fillRect(0, 0, gameSize, gameSize);

var curLevel = document.getElementById("level").innerHTML;
var maxLevel = 7, minLevel = 1;
var gameDelay = 400-curLevel*50;

let playerScore = 0;

let LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40;
//ve hinh vuong len bang
function drawRectOnboard(vt, color) {
  ctx.fillStyle = color;
  ctx.fillRect(vt.x*UNIT, vt.y*UNIT, UNIT, UNIT);
  ctx.fillStyle = 'blue';
  ctx.strokeRect(vt.x*UNIT, vt.y*UNIT, UNIT, UNIT);
}

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
    this.body = [new Vector(2, 3), 
                new Vector(3, 3),
                new Vector(4, 3)];
    this.head = this.body[0];

    this.curDirection = new Vector(-1, 0);
  }

  draw(){
    drawRectOnboard(this.body[0], HEAD_COLOR);
    for (let i=1; i<this.body.length; i++) {
      drawRectOnboard(this.body[i], SNAKE_COLOR);
    }
    
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
    //an 1 food
    let newPart = new Vector(0,0);
    newPart.Assign(this.body[this.size()-1]);
    newPart.Sub(this.body[this.size()-2]);
    newPart.add(this.body[this.size()-1]);

    this.body.push(newPart);
    this.draw();  
  }

  handleBound() {
    if (this.body[0].x < 0){
      this.body[0].x = gameSize/UNIT-1;
    }
    if (this.body[0].x > gameSize/UNIT-1){
      this.body[0].x = 0;
    }
    if (this.body[0].y < 0){
      this.body[0].y = gameSize/UNIT-1;
    }
    if (this.body[0].y > gameSize/UNIT-1){
      this.body[0].y = 0;
    }
  }

  checkDead() {
    //true la chet, false la song
    for (let i=1; i<this.size(); i++) {
      if (this.body[0].cmp(this.body[i]))
        return true;
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
    drawRectOnboard(this.pos, 'green');
  }

  getRandomPos() {
    let x = Math.floor(Math.round(Math.random()*(gameSize/UNIT-1)));
    let y = Math.floor(Math.round(Math.random()*(gameSize/UNIT-1)));
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
    //this.pos.Assign(this.getRandomPos());
    this.draw();
  }
}


let player = new snake();
player.draw();
let food = new Food(new Vector(5,5));
food.draw();

//vong lap de ran di chuyen moi 200s
setInterval(() => {
  player.move();
  if (player.checkDead()) {
    //window.location.;
  }
  if (player.checkEat(food)) {
    player.update();
    food.getNewFood(player.body);
    playerScore += curLevel;
    document.getElementById("score").innerHTML = playerScore;
  }
}, gameDelay);

document.onkeydown = function(e) {
  switch (e.keyCode) {

    case LEFT:
      if (player.curDirection.cmp(new Vector(1, 0)))
        break;
      player.curDirection = new Vector(-1, 0);
      break;

    case UP:
      if (player.curDirection.cmp(new Vector(0, 1)))
        break;
      player.curDirection = new Vector(0, -1);
      break;

    case RIGHT:
      if (player.curDirection.cmp(new Vector(-1, 0)))
        break;
      player.curDirection = new Vector(1, 0);
      break;

    case DOWN:
      if (player.curDirection.cmp(new Vector(0, -1)))
        break;
      player.curDirection = new Vector(0, 1);
      break;

    default:
      break;
  }
}

document.getElementById('upLevelBtn').onclick = function(){
  if (maxLevel > curLevel) {
    document.getElementById('level').innerHTML ++;
    curLevel ++;
  }
  gameDelay = 400-curLevel*50;
};

document.getElementById('downLevelBtn').onclick = function(){
  if (minLevel < curLevel) {
    document.getElementById('level').innerHTML --;
    curLevel --;
  }
  gameDelay = 400-curLevel*50;
};

document.getElementById('exitBtn').onclick = function(){
  
};