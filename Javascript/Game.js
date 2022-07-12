class Game {
  constructor() {
    this.curLevel = 1;
    this.player = new Snake();
    this.food = new Food(new Vector(5,5));
    this.myInterval;
    this.gameDelay = 400 - this.curLevel * 50;
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
    this.gameDelay = 400 - this.curLevel * 50;
  }
}