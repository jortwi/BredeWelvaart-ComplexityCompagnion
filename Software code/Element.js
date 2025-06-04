class Element {
  constructor({ x, y, r, increment, c1, c2, name, type }) {
    let colorPair = getColorPair();
    // console.log(colorPair);
    this.x = x;
    this.y = y;
    this.r = r;
    this.time = random(1000);
    this.increment = increment; //more will let the element to change more
    this.c1 = color(colorPair[0]); //inner color
    this.c2 = color(colorPair[1]); //outer color
    this.rings = 5; //ringNumber
    this.name = name;
    this.type = type ? type : "regular";
    this.lastClosestElement = "this is only used for white spots";
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.drawBorder = false;
  }

  display() {
    for (let i = 0; i < this.rings; i++) {
      let clr = lerpColor(this.c1, this.c2, i / this.rings);

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

    textAlign(CENTER, CENTER);
    textSize(this.r / 3);
    let txt = this.name;

    // Get the text width and height
    let txtWidth = textWidth(txt);
    let txtHeight = textAscent() + textDescent();

    // Draw semitransparent rounded rectangle behind text
    fill(255, 100); // RGBA - black with alpha for transparency
    if (this.drawBorder) {
      stroke(this.drawBorder);
      strokeWeight(3);
    } else {
      noStroke();
    }
    rectMode(CENTER);
    rect(this.x, this.y, txtWidth + 20, txtHeight + 10, 10); // rounded corners

    fill("black");
    text(this.name, this.x, this.y - 2); //the minus two sets the text more to the middle of the box
  }

  update() {
    this.increment = 0.0005 + 0.004 * sensorData.knob_vitality; //vitality directly influences all elements (there is always some element change)
    this.time += this.increment;
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    //if the element is a white spot, change do not let it move outside the canvas
    if (this.type !== "regular") {
      if (this.x > width - width / 10) {
        this.xSpeed = -1 * sensorData.knob_vitality;
      }
      if (this.x < 0 + width / 10) {
        this.xSpeed = 1 * sensorData.knob_vitality;
      }
      if (this.y > height - height / 10) {
        this.ySpeed = -1 * sensorData.knob_vitality;
      }
      if (this.y < 0 + height / 10) {
        this.ySpeed = 1 * sensorData.knob_vitality;
      }
    } else {
      //regular elements may also temporarily move due to vitality, in that case, just don't let it move outside of the frame
      if (this.x > width - width / 10) {
        this.x = width - width / 10;
      }
      if (this.x < 0 + width / 10) {
        this.x = width / 10;
      }
      if (this.y > height - height / 10) {
        this.y = height - height / 10;
      }
      if (this.y < 0 + height / 10) {
        this.y = height / 10;
      }
    }
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
