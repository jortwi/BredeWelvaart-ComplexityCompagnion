class Element {
  constructor({ x, y, r, increment, c1, c2, name }) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.time = 0;
    this.increment = increment; //more will let the element to change more
    this.c1 = c1; //inner color
    this.c2 = c2; //outer color
    this.rings = 5; //ringNumber
    this.name = name;
  }

  display() {
    let clr = color("white");
    for (let i = 0; i < this.rings; i++) {
      clr = lerpColor(this.c1, this.c2, i / this.rings);

      this.drawOrganicShape({
        x: this.x,
        y: this.y,
        r: (2 - i / this.rings) * this.r,
        noisePhase: this.time,
        numVertices: 20, //possibly change this later as well
        magnitude: 0.4, //possibly change this later as well
        noiseFrequency: 3, //possibly change this later as well
        c: clr,
        // strokeColor: color("black"),
      });
    }

    fill("black");
    text(this.name, this.x, this.y + this.r * 2 + 20);
  }

  update() {
    this.time += this.increment;
  }

  drawOrganicShape({
    x,
    y,
    r,
    noisePhase, // Used for animating or varying the noise pattern over time/calls
    numVertices = 20, // Number of points defining the shape's perimeter
    magnitude = 0.3, // How much radius can deviate (e.g., 0.3 = +/- 30%)
    noiseFrequency = 2, // Higher = more wiggles along the perimeter
    c, //color
    strokeColor,
  }) {
    push();
    translate(x, y);

    let vertices = []; // Array to store calculated vertex coordinates

    for (let i = 0; i < numVertices; i++) {
      let angle = map(i, 0, numVertices, 0, TWO_PI);

      let noiseX = map(cos(angle), -1, 1, 0, noiseFrequency);
      let noiseY = map(sin(angle), -1, 1, 0, noiseFrequency);

      let noiseValue = noise(noiseX + noisePhase, noiseY + noisePhase);

      let radiusMultiplier = map(
        noiseValue,
        0,
        1,
        1 - magnitude,
        1 + magnitude
      );

      let currentRadius = r * radiusMultiplier;

      let x = currentRadius * cos(angle);
      let y = currentRadius * sin(angle);

      vertices.push({ x: x, y: y });
    }

    //only fill if a color has been provided
    if (c) {
      fill(c);
    } else {
      noFill();
    }

    //only add a stroke if a strokeColor has been provided
    if (strokeColor) {
      stroke(strokeColor);
    } else {
      noStroke();
    }

    //fixes line thickness
    strokeWeight(2);

    beginShape();

    // Ensure we have enough vertices for a curve
    if (vertices.length < 2) {
      if (vertices.length === 1) vertex(vertices[0].x, vertices[0].y); // Draw a point if only one
      endShape();
      pop();
      return;
    }

    // 1. First control point: Use the last calculated vertex
    curveVertex(
      vertices[vertices.length - 1].x,
      vertices[vertices.length - 1].y
    );

    // 2. Actual vertices for the curve
    for (let v of vertices) {
      curveVertex(v.x, v.y);
    }

    // 3. Last control point: Use the first calculated vertex
    curveVertex(vertices[0].x, vertices[0].y);

    if (vertices.length > 1) {
      curveVertex(vertices[1].x, vertices[1].y);
    }

    endShape();
    pop();
  }
}
