class snake {
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

  draw() {
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
    let maxPositionValue = GAMESIZE/UNIT-1;
    if (this.body[0].x < 0) {
      this.body[0].x = maxPositionValue;
    }
    if (this.body[0].x > maxPositionValue) {
      this.body[0].x = 0;
    }
    if (this.body[0].y < 0) {
      this.body[0].y = maxPositionValue;
    }
    if (this.body[0].y > maxPositionValue) {
      this.body[0].y = 0;
    }
  }

  //true la chet, false la song
  checkDead() {
    for (let i=1; i<this.size(); i++) {
      if (this.body[0].cmp(this.body[i])) {
        this.sadAudio.play();
        return true;
      }
    }
    return false;
  }
}