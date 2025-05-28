function preload() {
  //
}

function setup() {
  let canvas = createCanvas(1920, 1080); //not ideal
  canvas.parent("canvas");

  //set cursors start location
  cursor.x = width / 2;
  cursor.y = height / 2;

  textAlign(CENTER, CENTER);
  textSize(12);
  //   noStroke();

  b1 = new Element(
    width / 2,
    height / 2,
    50,
    0.001,
    color("red"),
    color("white")
  );
  b2 = new Element(
    width / 3,
    height / 3,
    30,
    0.001,
    color("navy"),
    color("#1100FF")
  );
  b3 = new Element(1700, 800, 40, 0.001, color("#DDBEA9"), color("#F7DECA"));

  r1 = new Relation(b1, b2, "amplifying");
  r2 = new Relation(b1, b3, "neutral");
  r3 = new Relation(b2, b3, "undefined");
}

function draw() {
  //color issue: probably an issue with the copying of this.e1.c1. changes to that value pass on. See neutral() function in Relation.js

  background("white");

  //first render relations so they stay behind the elements
  r1.display();
  r2.display();
  r3.display();

  b1.display();
  b1.update();

  b2.display();
  b2.update();

  b3.display();
  b3.update();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
