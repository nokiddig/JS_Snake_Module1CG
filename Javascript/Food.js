class Food {
  constructor(vt2) {
    this.pos = new Vector();
    this.pos.assign(vt2);
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
    while(check == false){
      this.pos.assign(this.getRandomPos());
      for (let i = 0; i < arr.length; i++)
        if (this.pos.compare(arr[i])) {
          check = true;
          break;
        }
      check = check == true ? false : true;
    }
    this.draw();
  }
}