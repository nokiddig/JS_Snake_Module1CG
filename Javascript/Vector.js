class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vt2) {
    this.x += vt2.x;
    this.y += vt2.y;
  }

  sub(vt2) {
    this.x -= vt2.x;
    this.y -= vt2.y;
  }

  assign(vt2) {
    this.x = vt2.x;
    this.y = vt2.y;
  }

  compare(vt2) {
    return (this.x == vt2.x && this.y == vt2.y);
  }
}