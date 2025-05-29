class Relation {
  constructor(e1, e2, type) {
    this.e1 = e1; //element 1
    this.e2 = e2; //element 2
    this.type = type;
    this.time = 0;
    this.c1 = this.e1.c1;
    this.c2 = this.e2.c1;
    this.weight = 5;
  }

  display() {
    if (this.type === "undefined") {
      this.undefined();
    } else if (this.type === "amplifying") {
      this.amplifying();
    } else if (this.type === "balancing") {
    } else if (this.type === "flow") {
    } else if (this.type === "resonance") {
    } else if (this.type === "delaying") {
    } else {
      //draw nothing if no relation type was specified -- elements are always related
    }
  }

  // Helper method to calculate a point on a quadratic Bezier curve
  _quadraticPoint(p0x, p0y, cpx, cpy, p1x, p1y, t) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const x = uu * p0x + 2 * u * t * cpx + tt * p1x;
    const y = uu * p0y + 2 * u * t * cpy + tt * p1y;
    return { x: x, y: y };
  }

  //make this organic also
  undefined() {
    const x1 = this.e1.x;
    const y1 = this.e1.y;
    const r1 = this.e1.r === undefined ? 10 : this.e1.r;
    const c1_val = this.e1.c1 || color(150, 150, 150); // Default color if undefined

    const x2 = this.e2.x;
    const y2 = this.e2.y;
    const r2 = this.e2.r === undefined ? 10 : this.e2.r;
    const c2_val = this.e2.c1 || color(180, 180, 180); // Default color if undefined

    // Ensure colors are p5.Color objects and set desired alpha
    const startColor = color(c1_val);
    startColor.setAlpha(100); // Partly transparent
    const endColor = color(c2_val);
    endColor.setAlpha(100); // Partly transparent

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) return;

    const ux = dx / dist;
    const uy = dy / dist;
    const px = -uy;
    const py = ux;

    const halfW1 = r1;
    const halfW2 = r2;

    const midWidthFactor = 0.3;
    const minHalfMidWidth = 1;
    let calculatedHalfMidWidth = ((halfW1 + halfW2) / 2) * midWidthFactor;
    const halfMidW = Math.max(minHalfMidWidth, calculatedHalfMidWidth);

    const p1A = { x: x1 + px * halfW1, y: y1 + py * halfW1 }; // Top-left
    const p1B = { x: x1 - px * halfW1, y: y1 - py * halfW1 }; // Bottom-left

    const p2A = { x: x2 + px * halfW2, y: y2 + py * halfW2 }; // Top-right
    const p2B = { x: x2 - px * halfW2, y: y2 - py * halfW2 }; // Bottom-right

    const midLineX = (x1 + x2) / 2;
    const midLineY = (y1 + y2) / 2;

    const apexTop = {
      x: midLineX + px * halfMidW,
      y: midLineY + py * halfMidW,
    };
    const apexBottom = {
      x: midLineX - px * halfMidW,
      y: midLineY - py * halfMidW,
    };

    // Control points for the Bezier curves
    // For curve p1A -> apexTop -> p2A
    const cpA = {
      x: 2 * apexTop.x - (p1A.x + p2A.x) / 2,
      y: 2 * apexTop.y - (p1A.y + p2A.y) / 2,
    };
    // For curve p1B -> apexBottom -> p2B
    const cpB = {
      x: 2 * apexBottom.x - (p1B.x + p2B.x) / 2,
      y: 2 * apexBottom.y - (p1B.y + p2B.y) / 2,
    };

    const numSegments = 50; // Number of segments to draw for the gradient
    noStroke();

    for (let i = 0; i < numSegments; i++) {
      const t0 = i / numSegments;
      const t1 = (i + 1) / numSegments;

      const segColor = lerpColor(startColor, endColor, (t0 + t1) / 2);
      fill(segColor);

      // Points for the current segment quadrilateral
      const pt_top_t0 = this._quadraticPoint(
        p1A.x,
        p1A.y,
        cpA.x,
        cpA.y,
        p2A.x,
        p2A.y,
        t0
      );
      const pt_top_t1 = this._quadraticPoint(
        p1A.x,
        p1A.y,
        cpA.x,
        cpA.y,
        p2A.x,
        p2A.y,
        t1
      );
      const pt_bottom_t0 = this._quadraticPoint(
        p1B.x,
        p1B.y,
        cpB.x,
        cpB.y,
        p2B.x,
        p2B.y,
        t0
      );
      const pt_bottom_t1 = this._quadraticPoint(
        p1B.x,
        p1B.y,
        cpB.x,
        cpB.y,
        p2B.x,
        p2B.y,
        t1
      );
      beginShape();
      vertex(pt_top_t0.x, pt_top_t0.y);
      vertex(pt_top_t1.x, pt_top_t1.y);
      vertex(pt_bottom_t1.x, pt_bottom_t1.y);
      vertex(pt_bottom_t0.x, pt_bottom_t0.y);
      endShape(CLOSE);
    }
  }

  amplifying() {
    this.soundLine(
      this.e1.x,
      this.e1.y,
      this.e2.x,
      this.e2.y,
      50,
      2,
      this.time
    );
    this.time += 0.01;
  }

  soundLine(x1, y1, x2, y2, amplitude, increment, animationTime) {
    let prevX = 0;
    let currentX = 0; // Renamed 'x' to 'currentX' to avoid confusion in this scope
    let prevY = 0;
    let currentY = 0; // Renamed 'y' to 'currentY'
    let ampl = 1;
    let dist = sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

    push();
    strokeWeight(this.weight);
    translate(x1, y1);
    let angle = atan2(y2 - y1, x2 - x1);
    rotate(angle);

    // Control how "fast" the noise changes along the line and over time
    let noiseScaleSpatial = 0.05; // How much the noise changes per pixel along the line
    let noiseScaleTime = 1; // How much the noise changes per frame (animationTime unit)

    for (let i = 0; i < dist; i += increment) {
      currentX += increment;
      // Use 2D noise:
      // 1st dimension: i * noiseScaleSpatial (position along the line)
      // 2nd dimension: animationTime * noiseScaleTime (time)
      // Optional: add this.noiseSeedOffset to animationTime if you want unique patterns per relation
      // let noiseValue = noise(i * noiseScaleSpatial + this.noiseSeedOffset, animationTime * noiseScaleTime);
      let noiseValue = noise(
        i * noiseScaleSpatial,
        animationTime * noiseScaleTime
      );
      currentY = ampl * (noiseValue - 0.5); // noise() returns 0-1, so subtract 0.5 for -0.5 to 0.5
      stroke(lerpColor(this.c1, this.c2, i / dist));
      line(prevX, prevY, currentX, currentY);
      prevX = currentX;
      prevY = currentY;

      // Amplitude shaping (envelope)
      if (i < dist / 6) {
        ampl = 0;
      } else if (i < dist / 2) {
        ampl += (amplitude / (dist / 2 - dist / 6)) * increment; // More robust amplitude increase
        ampl = min(ampl, amplitude * 10); // Cap amplitude to prevent it growing too large
      } else if (i < (dist * 5) / 6) {
        ampl -= (amplitude / ((dist * 5) / 6 - dist / 2)) * increment; // More robust amplitude decrease
        ampl = max(ampl, 0); // Ensure amplitude doesn't go negative
      } else {
        ampl = 0;
      }
      ampl = constrain(ampl, 0, amplitude * 10); // General constrain
    }

    pop();
  }
}
