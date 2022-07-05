class Vector {
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