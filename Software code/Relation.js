// class Relation {
//   constructor(e1, e2, type) {
//     this.e1 = e1; //element 1
//     this.e2 = e2; //element 2
//     this.type = type;
//     this.time = 0;
//     this.c1 = this.e1.c1;
//     this.c2 = this.e2.c1;
//     this.weight = 5;
//     this.strength = 50;
//     this.positivity = 50;
//   }

//   display() {
//     if (this.type === "undefined") {
//       this.undefined();
//     } else if (this.type === "amplifying") {
//       this.amplifying();
//     } else if (this.type === "balancing") {
//       this.drawLine();
//     } else if (this.type === "flow") {
//       this.drawLine();
//     } else if (this.type === "resonance") {
//       this.drawLine();
//     } else if (this.type === "delaying") {
//       this.drawLine();
//     } else {
//       //draw nothing if no relation type was specified -- elements are always related
//       // this.drawLine();
//     }
//   }

//   drawLine() {
//     push();
//     stroke(127);
//     strokeWeight(this.strength / 15);
//     line(this.e1.x, this.e1.y, this.e2.x, this.e2.y);
//     pop();
//   }

//   // Helper method to calculate a point on a quadratic Bezier curve
//   _quadraticPoint(p0x, p0y, cpx, cpy, p1x, p1y, t) {
//     const u = 1 - t;
//     const tt = t * t;
//     const uu = u * u;
//     const x = uu * p0x + 2 * u * t * cpx + tt * p1x;
//     const y = uu * p0y + 2 * u * t * cpy + tt * p1y;
//     return { x: x, y: y };
//   }

//   //make this organic also
//   undefined() {
//     const x1 = this.e1.x;
//     const y1 = this.e1.y;
//     const r1 = this.e1.r === undefined ? 10 : this.e1.r;
//     const c1_val = this.e1.c1 || color(150, 150, 150); // Default color if undefined

//     const x2 = this.e2.x;
//     const y2 = this.e2.y;
//     const r2 = this.e2.r === undefined ? 10 : this.e2.r;
//     const c2_val = this.e2.c1 || color(180, 180, 180); // Default color if undefined

//     // Ensure colors are p5.Color objects and set desired alpha
//     const startColor = color(c1_val);
//     startColor.setAlpha(100); // Partly transparent
//     const endColor = color(c2_val);
//     endColor.setAlpha(100); // Partly transparent

//     const dx = x2 - x1;
//     const dy = y2 - y1;
//     const dist = Math.sqrt(dx * dx + dy * dy);

//     if (dist === 0) return;

//     const ux = dx / dist;
//     const uy = dy / dist;
//     const px = -uy;
//     const py = ux;

//     const halfW1 = r1;
//     const halfW2 = r2;

//     const midWidthFactor = 0.3;
//     const minHalfMidWidth = 1;
//     let calculatedHalfMidWidth = ((halfW1 + halfW2) / 2) * midWidthFactor;
//     const halfMidW = Math.max(minHalfMidWidth, calculatedHalfMidWidth);

//     const p1A = { x: x1 + px * halfW1, y: y1 + py * halfW1 }; // Top-left
//     const p1B = { x: x1 - px * halfW1, y: y1 - py * halfW1 }; // Bottom-left

//     const p2A = { x: x2 + px * halfW2, y: y2 + py * halfW2 }; // Top-right
//     const p2B = { x: x2 - px * halfW2, y: y2 - py * halfW2 }; // Bottom-right

//     const midLineX = (x1 + x2) / 2;
//     const midLineY = (y1 + y2) / 2;

//     const apexTop = {
//       x: midLineX + px * halfMidW,
//       y: midLineY + py * halfMidW,
//     };
//     const apexBottom = {
//       x: midLineX - px * halfMidW,
//       y: midLineY - py * halfMidW,
//     };

//     // Control points for the Bezier curves
//     // For curve p1A -> apexTop -> p2A
//     const cpA = {
//       x: 2 * apexTop.x - (p1A.x + p2A.x) / 2,
//       y: 2 * apexTop.y - (p1A.y + p2A.y) / 2,
//     };
//     // For curve p1B -> apexBottom -> p2B
//     const cpB = {
//       x: 2 * apexBottom.x - (p1B.x + p2B.x) / 2,
//       y: 2 * apexBottom.y - (p1B.y + p2B.y) / 2,
//     };

//     const numSegments = 50; // Number of segments to draw for the gradient
//     noStroke();

//     for (let i = 0; i < numSegments; i++) {
//       const t0 = i / numSegments;
//       const t1 = (i + 1) / numSegments;

//       const segColor = lerpColor(startColor, endColor, (t0 + t1) / 2);
//       fill(segColor);

//       // Points for the current segment quadrilateral
//       const pt_top_t0 = this._quadraticPoint(
//         p1A.x,
//         p1A.y,
//         cpA.x,
//         cpA.y,
//         p2A.x,
//         p2A.y,
//         t0
//       );
//       const pt_top_t1 = this._quadraticPoint(
//         p1A.x,
//         p1A.y,
//         cpA.x,
//         cpA.y,
//         p2A.x,
//         p2A.y,
//         t1
//       );
//       const pt_bottom_t0 = this._quadraticPoint(
//         p1B.x,
//         p1B.y,
//         cpB.x,
//         cpB.y,
//         p2B.x,
//         p2B.y,
//         t0
//       );
//       const pt_bottom_t1 = this._quadraticPoint(
//         p1B.x,
//         p1B.y,
//         cpB.x,
//         cpB.y,
//         p2B.x,
//         p2B.y,
//         t1
//       );
//       beginShape();
//       vertex(pt_top_t0.x, pt_top_t0.y);
//       vertex(pt_top_t1.x, pt_top_t1.y);
//       vertex(pt_bottom_t1.x, pt_bottom_t1.y);
//       vertex(pt_bottom_t0.x, pt_bottom_t0.y);
//       endShape(CLOSE);
//     }
//   }

//   amplifying() {
//     this.soundLine(
//       this.e1.x,
//       this.e1.y,
//       this.e2.x,
//       this.e2.y,
//       50,
//       2,
//       this.time
//     );
//     this.time += 0.01;
//   }

//   soundLine(x1, y1, x2, y2, amplitude, increment, animationTime) {
//     let prevX = 0;
//     let currentX = 0; // Renamed 'x' to 'currentX' to avoid confusion in this scope
//     let prevY = 0;
//     let currentY = 0; // Renamed 'y' to 'currentY'
//     let ampl = 1;
//     let dist = sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

//     push();
//     strokeWeight(this.weight);
//     translate(x1, y1);
//     let angle = atan2(y2 - y1, x2 - x1);
//     rotate(angle);

//     // Control how "fast" the noise changes along the line and over time
//     let noiseScaleSpatial = 0.05; // How much the noise changes per pixel along the line
//     let noiseScaleTime = 1; // How much the noise changes per frame (animationTime unit)

//     for (let i = 0; i < dist; i += increment) {
//       currentX += increment;
//       // Use 2D noise:
//       // 1st dimension: i * noiseScaleSpatial (position along the line)
//       // 2nd dimension: animationTime * noiseScaleTime (time)
//       // Optional: add this.noiseSeedOffset to animationTime if you want unique patterns per relation
//       // let noiseValue = noise(i * noiseScaleSpatial + this.noiseSeedOffset, animationTime * noiseScaleTime);
//       let noiseValue = noise(
//         i * noiseScaleSpatial,
//         animationTime * noiseScaleTime
//       );
//       currentY = ampl * (noiseValue - 0.5); // noise() returns 0-1, so subtract 0.5 for -0.5 to 0.5

//       //test to see if it makes sense to let positivity affect alpha values
//       let strokeClrTest = lerpColor(this.c1, this.c2, i / dist);
//       strokeClrTest.setAlpha(12 * this.positivity);

//       stroke(strokeClrTest);
//       line(prevX, prevY, currentX, currentY);
//       prevX = currentX;
//       prevY = currentY;

//       // Amplitude shaping (envelope)
//       if (i < dist / 6) {
//         ampl = 0;
//       } else if (i < dist / 2) {
//         ampl += (amplitude / (dist / 2 - dist / 6)) * increment; // More robust amplitude increase
//         ampl = min(ampl, amplitude * 10); // Cap amplitude to prevent it growing too large
//       } else if (i < (dist * 5) / 6) {
//         ampl -= (amplitude / ((dist * 5) / 6 - dist / 2)) * increment; // More robust amplitude decrease
//         ampl = max(ampl, 0); // Ensure amplitude doesn't go negative
//       } else {
//         ampl = 0;
//       }
//       ampl = constrain(ampl, 0, amplitude * 10); // General constrain
//     }

//     pop();
//   }
// }

///////////
//GENERATED BY GOOGLE AI GEMINI 2.5 PREVIEW 05-06
///////////
class Relation {
  constructor(e1, e2, type) {
    this.e1 = e1;
    this.e2 = e2;
    this.type = type;
    this.time = 0;
    this.strength = 50;
    this.positivity = 50;
    this.relationColor = color(getColor());

    // --- Tweakable Parameters ---

    // Undefined (Neutral) Relation
    this.undefined_strokeAlpha = 150;
    this.undefined_baseThicknessMin = 0.5;
    this.undefined_baseThicknessMax = 4;
    this.undefined_endFactor = 1.5;
    this.undefined_radiusInfluence = 0.05;

    // Balancing Relation
    this.balancing_lineBaseThickness = 0.5;
    this.balancing_lineStrengthThickness = 3;
    this.balancing_blobBaseSize = 6;
    this.balancing_blobStrengthSize = 10;
    this.balancing_blobMergeFactor = 1.6;
    this.balancing_animationSpeed = 0.015;

    // Flow Relation
    this.flow_lineBaseThickness = 1;
    this.flow_lineStrengthThickness = 4;
    this.flow_numArrowPairs = 3;
    this.flow_arrowBaseSize = 4;
    this.flow_arrowStrengthSize = 6;
    this.flow_animationSpeed = 0.008;
    this.flow_waveAmplitude = 10;
    this.flow_waveFrequency = 0.1;
    this.flow_waveTimeSpeed = 0.05;
    this.flow_segments = 20;

    // Resonance Relation
    this.resonance_rectBaseLength = 8;
    this.resonance_rectStrengthLength = 12;
    this.resonance_rectBaseWidth = 3;
    this.resonance_rectStrengthWidth = 8;
    this.resonance_lengthRatios = [1.0, 0.75, 0.5];
    this.resonance_animationSpeed = 0.006;
    this.resonance_spacingFactor = 1.5;

    // Delaying Relation
    this.delaying_lineBaseThickness = 0.5;
    this.delaying_lineStrengthThickness = 3;
    this.delaying_arrowBaseSize = 5;
    this.delaying_arrowStrengthSize = 8;
    this.delaying_animationSpeed = 0.003;
    this.delaying_leaderStartProgress = 0.15;
    this.delaying_followerRelativeSpeed = 1.1; //1 is same speed, 1.2 is catchin up
    this.delaying_leaderDecelerationFactor = 3; // 1 for linear, 2 for quad, 3 for cubic ease-out etc.

    // Glow Effect
    this.glow_blurSteps = 8;
    this.glow_maxOpacity = 70;
    this.glow_sizeFactor = 10.0;
  }

  display() {
    push();
    let e1Pos = createVector(this.e1.x, this.e1.y);
    let e2Pos = createVector(this.e2.x, this.e2.y);
    let delta = p5.Vector.sub(e2Pos, e1Pos);
    let angle = delta.heading();
    let d = delta.mag();

    if (d < 1) {
      pop();
      this.time += 1;
      return;
    }

    // Centralized glow drawing for relations with a simple straight path glow
    if (
      this.type !== "delaying" &&
      this.type !== "flow" &&
      this.type !== "resonance" &&
      this.type !== "amplifying"
    ) {
      let baseThicknessForGlow = 1;
      if (this.type === "undefined") {
        baseThicknessForGlow = map(
          this.strength,
          0,
          100,
          this.undefined_baseThicknessMin,
          this.undefined_baseThicknessMax
        );
      } else if (this.type === "balancing") {
        baseThicknessForGlow = map(
          this.strength,
          0,
          100,
          this.balancing_lineBaseThickness,
          this.balancing_lineBaseThickness +
            this.balancing_lineStrengthThickness
        );
      }
      this.drawGlow(e1Pos, e2Pos, d, angle, baseThicknessForGlow);
    }

    // Call specific relation drawing function
    if (this.type === "undefined") {
      this.undefinedRelation(e1Pos, e2Pos, d, angle);
    } else if (this.type === "amplifying") {
      this.amplifying(e1Pos, e2Pos, d, angle);
    } else if (this.type === "balancing") {
      this.balancing(e1Pos, e2Pos, d, angle);
    } else if (this.type === "flow") {
      this.flow(e1Pos, e2Pos, d, angle);
    } else if (this.type === "resonance") {
      this.resonance(e1Pos, e2Pos, d, angle);
    } else if (this.type === "delaying") {
      this.delaying(e1Pos, e2Pos, d, angle);
    }
    pop();

    this.time += 1; // Increment time for animations
  }

  // Glow effect method - draws a glow along a straight line path
  drawGlow(p1, p2, d, ang, baseStrokeWeight) {
    if (this.positivity === 50 || baseStrokeWeight <= 0) return;

    let glowColorVal;
    let glowOpacity = map(
      abs(this.positivity - 50),
      0,
      50,
      0,
      this.glow_maxOpacity
    );

    if (this.positivity < 50) {
      glowColorVal = color(0, glowOpacity);
    } else {
      let baseCol = this.relationColor;
      glowColorVal = color(
        red(baseCol),
        green(baseCol),
        blue(baseCol),
        glowOpacity
      );
    }

    push();
    stroke(glowColorVal);
    translate(p1.x, p1.y);
    rotate(ang);
    for (let i = this.glow_blurSteps; i >= 1; i--) {
      let currentGlowWeight =
        baseStrokeWeight +
        baseStrokeWeight *
          (this.glow_sizeFactor - 1) *
          (i / this.glow_blurSteps);
      strokeWeight(currentGlowWeight);
      line(0, 0, d, 0);
    }
    pop();
  }

  drawArrow(x, y, rot, size, col) {
    push();
    translate(x, y);
    rotate(rot);
    fill(col);
    noStroke();
    triangle(0, 0, -size, -size / 2, -size, size / 2);
    pop();
  }

  undefinedRelation(p1, p2, d, ang) {
    let midThickness = map(
      this.strength,
      0,
      100,
      this.undefined_baseThicknessMin,
      this.undefined_baseThicknessMax
    );
    let end1RadiusInfluence =
      this.e1.r * this.undefined_radiusInfluence * (this.strength / 100);
    let end2RadiusInfluence =
      this.e2.r * this.undefined_radiusInfluence * (this.strength / 100);
    let end1Thickness =
      midThickness * this.undefined_endFactor + end1RadiusInfluence;
    let end2Thickness =
      midThickness * this.undefined_endFactor + end2RadiusInfluence;

    let colWithAlpha = this.relationColor;
    colWithAlpha.setAlpha(this.undefined_strokeAlpha);
    fill(colWithAlpha);
    noStroke();

    push();
    translate(p1.x, p1.y);
    rotate(ang);
    beginShape();
    vertex(0, -end1Thickness / 2);
    quadraticVertex(
      d * 0.25,
      -lerp(end1Thickness, midThickness, 0.5) / 2,
      d * 0.5,
      -midThickness / 2
    );
    quadraticVertex(
      d * 0.75,
      -lerp(midThickness, end2Thickness, 0.5) / 2,
      d,
      -end2Thickness / 2
    );
    vertex(d, end2Thickness / 2);
    quadraticVertex(
      d * 0.75,
      lerp(midThickness, end2Thickness, 0.5) / 2,
      d * 0.5,
      midThickness / 2
    );
    quadraticVertex(
      d * 0.25,
      lerp(end1Thickness, midThickness, 0.5) / 2,
      0,
      end1Thickness / 2
    );
    endShape(CLOSE);
    pop();
    colWithAlpha.setAlpha(255);
  }

  balancing(p1, p2, d, ang) {
    let lineThickness = map(
      this.strength,
      0,
      100,
      this.balancing_lineBaseThickness,
      this.balancing_lineBaseThickness + this.balancing_lineStrengthThickness
    );
    let blobSize = map(
      this.strength,
      0,
      100,
      this.balancing_blobBaseSize,
      this.balancing_blobBaseSize + this.balancing_blobStrengthSize
    );
    let progress = (this.time * this.balancing_animationSpeed) % 1;
    let mainCol = this.relationColor;

    push();
    translate(p1.x, p1.y);
    rotate(ang);
    stroke(mainCol);
    strokeWeight(lineThickness);
    line(0, 0, d, 0);
    fill(mainCol);
    noStroke();

    let movePhaseEnd = 0.4;
    let mergePhaseEnd = 0.6;
    let disappearPhaseEnd = 1.0;

    if (progress < movePhaseEnd) {
      let phaseProgress = map(progress, 0, movePhaseEnd, 0, 1);
      let pos1 = lerp(0, d / 2 - blobSize * 0.6, phaseProgress);
      let pos2 = lerp(d, d / 2 + blobSize * 0.6, phaseProgress);
      ellipse(pos1, 0, blobSize, blobSize);
      ellipse(pos2, 0, blobSize, blobSize);
    } else if (progress < mergePhaseEnd) {
      let phaseProgress = map(progress, movePhaseEnd, mergePhaseEnd, 0, 1);
      let currentSize = lerp(
        blobSize,
        blobSize * this.balancing_blobMergeFactor,
        phaseProgress
      );
      ellipse(d / 2, 0, currentSize, currentSize);
    } else {
      let phaseProgress = map(progress, mergePhaseEnd, disappearPhaseEnd, 0, 1);
      let currentSize = lerp(
        blobSize * this.balancing_blobMergeFactor,
        0,
        phaseProgress
      );
      let currentAlpha = lerp(255, 0, phaseProgress);
      let tempCol = color(
        red(mainCol),
        green(mainCol),
        blue(mainCol),
        currentAlpha
      );
      fill(tempCol);
      ellipse(d / 2, 0, currentSize, currentSize);
    }
    pop();
  }

  flow(p1, p2, d, ang) {
    let lineThickness = map(
      this.strength,
      0,
      100,
      this.flow_lineBaseThickness,
      this.flow_lineBaseThickness + this.flow_lineStrengthThickness
    );
    let arrowSize = map(
      this.strength,
      0,
      100,
      this.flow_arrowBaseSize,
      this.flow_arrowBaseSize + this.flow_arrowStrengthSize
    );
    let mainCol = this.relationColor;
    let arrowCol = this.relationColor;

    push();
    translate(p1.x, p1.y);
    rotate(ang);

    let curvePoints = [];
    for (let i = 0; i <= this.flow_segments; i++) {
      let t = i / this.flow_segments;
      let x = t * d;
      let waveEffect = sin(
        t * this.flow_waveFrequency * d * 0.01 +
          this.time * this.flow_waveTimeSpeed
      );
      let yOffset =
        waveEffect *
        this.flow_waveAmplitude *
        map(this.strength, 0, 100, 0.5, 1.5);
      curvePoints.push(createVector(x, yOffset));
    }

    if (this.positivity !== 50 && lineThickness > 0) {
      let glowColorVal;
      let glowOpacity = map(
        abs(this.positivity - 50),
        0,
        50,
        0,
        this.glow_maxOpacity
      );
      if (this.positivity < 50) {
        glowColorVal = color(0, glowOpacity);
      } else {
        glowColorVal = color(
          red(mainCol),
          green(mainCol),
          blue(mainCol),
          glowOpacity
        );
      }
      stroke(glowColorVal);
      noFill();
      for (let i = this.glow_blurSteps; i >= 1; i--) {
        let currentGlowWeight =
          lineThickness +
          lineThickness *
            (this.glow_sizeFactor - 1) *
            (i / this.glow_blurSteps);
        strokeWeight(currentGlowWeight);
        beginShape();
        for (let v of curvePoints) {
          vertex(v.x, v.y);
        }
        endShape();
      }
    }

    noFill();
    stroke(mainCol);
    strokeWeight(lineThickness);
    beginShape();
    for (let v of curvePoints) {
      vertex(v.x, v.y);
    }
    endShape();

    let segLengths = [];
    let pathTotalLength = 0;
    for (let i = 0; i < curvePoints.length - 1; i++) {
      let len = p5.Vector.dist(curvePoints[i], curvePoints[i + 1]);
      segLengths.push(len);
      pathTotalLength += len;
    }

    if (pathTotalLength < 0.1) {
      pop();
      return;
    }

    let overallProgress = (this.time * this.flow_animationSpeed) % 1.0;
    let directionPhase = floor(overallProgress * 2);
    let phaseProgressTime = (overallProgress * 2) % 1.0;

    for (let i = 0; i < this.flow_numArrowPairs; i++) {
      let initialPhaseOffset = i / this.flow_numArrowPairs;
      let progress = (phaseProgressTime + initialPhaseOffset) % 1;

      let distAlongPath;
      let baseAngleOffset = 0;

      if (directionPhase === 0) {
        distAlongPath = progress * pathTotalLength;
      } else {
        distAlongPath = (1 - progress) * pathTotalLength;
        baseAngleOffset = PI;
      }

      let currentDist = 0;
      for (let k = 0; k < segLengths.length; k++) {
        if (currentDist + segLengths[k] >= distAlongPath) {
          let partProgress =
            (distAlongPath - currentDist) /
            (segLengths[k] > 0 ? segLengths[k] : 1);
          partProgress = constrain(partProgress, 0, 1);
          let pA = curvePoints[k];
          let pB = curvePoints[k + 1];
          let finalPos = p5.Vector.lerp(pA, pB, partProgress);
          let dirVec = p5.Vector.sub(pB, pA);
          let finalAngle = dirVec.heading() + baseAngleOffset;
          this.drawArrow(
            finalPos.x,
            finalPos.y,
            finalAngle,
            arrowSize,
            arrowCol
          );
          break;
        }
        currentDist += segLengths[k];
      }
    }
    pop();
  }

  resonance(p1, p2, d, ang) {
    let baseLength = map(
      this.strength,
      0,
      100,
      this.resonance_rectBaseLength,
      this.resonance_rectBaseLength + this.resonance_rectStrengthLength
    );
    let rectWidth = map(
      this.strength,
      0,
      100,
      this.resonance_rectBaseWidth,
      this.resonance_rectBaseWidth + this.resonance_rectStrengthWidth
    );
    let mainCol = this.relationColor;
    let rectLengths = this.resonance_lengthRatios.map(
      (ratio) => baseLength * ratio
    );
    let spacing = rectLengths[0] * this.resonance_spacingFactor;

    let overallProgress = (this.time * this.resonance_animationSpeed) % 1.0;
    let directionPhase = floor(overallProgress * 2);
    let phaseProgress = (overallProgress * 2) % 1.0;

    push();
    translate(p1.x, p1.y);
    rotate(ang);
    rectMode(CENTER);

    let groupFrontToBackSpan = 0;
    if (rectLengths.length > 0) {
      groupFrontToBackSpan =
        (rectLengths.length - 1) * spacing +
        rectLengths[rectLengths.length - 1];
    }
    let effectiveTravelDist = d + groupFrontToBackSpan;
    let groupLeadPos =
      phaseProgress * effectiveTravelDist - groupFrontToBackSpan / 2;

    for (let i = 0; i < rectLengths.length; i++) {
      let currentRectLength = rectLengths[i];
      let x_offset = i * spacing;
      let rectCenterPos;

      if (directionPhase === 0) {
        rectCenterPos = groupLeadPos - x_offset;
      } else {
        rectCenterPos = d - (groupLeadPos - x_offset);
      }

      if (
        rectCenterPos + currentRectLength / 2 > -rectLengths[0] &&
        rectCenterPos - currentRectLength / 2 < d + rectLengths[0]
      ) {
        if (this.positivity !== 50 && rectWidth > 0) {
          let glowColorVal;
          let glowOpacity = map(
            abs(this.positivity - 50),
            0,
            50,
            0,
            this.glow_maxOpacity
          );
          if (this.positivity < 50) {
            glowColorVal = color(0, glowOpacity);
          } else {
            glowColorVal = color(
              red(mainCol),
              green(mainCol),
              blue(mainCol),
              glowOpacity
            );
          }

          noStroke();
          for (let j = this.glow_blurSteps; j >= 1; j--) {
            let expansionFactor =
              (this.glow_sizeFactor - 1) * (j / this.glow_blurSteps);
            let glowExpansion = rectWidth * expansionFactor * 0.5;
            let glowW = rectWidth + glowExpansion * 2;
            let glowL = currentRectLength + glowExpansion * 2;
            let R = red(glowColorVal);
            let G = green(glowColorVal);
            let B = blue(glowColorVal);
            let A = alpha(glowColorVal) / this.glow_blurSteps;
            fill(R, G, B, A);
            rect(rectCenterPos, 0, glowL, glowW);
          }
        }

        fill(mainCol);
        noStroke();
        rect(rectCenterPos, 0, currentRectLength, rectWidth);
      }
    }
    pop();
  }

  delaying(p1, p2, d, ang) {
    let lineThickness = map(
      this.strength,
      0,
      100,
      this.delaying_lineBaseThickness,
      this.delaying_lineBaseThickness + this.delaying_lineStrengthThickness
    );
    let arrowSize = map(
      this.strength,
      0,
      100,
      this.delaying_arrowBaseSize,
      this.delaying_arrowBaseSize + this.delaying_arrowStrengthSize
    );
    let mainCol = this.relationColor;

    push();
    translate(p1.x, p1.y);
    rotate(ang);

    let overallCycleProgress = (this.time * this.delaying_animationSpeed) % 1.0;
    let directionPhase = floor(overallCycleProgress * 2);
    let leaderLinearProgress = (overallCycleProgress * 2) % 1.0; // Linear progress for current phase

    let startX = 0;
    let endX = d;
    let arrowAngle = 0;

    if (directionPhase === 1) {
      // e2 -> e1
      startX = d;
      endX = 0;
      arrowAngle = PI;
    }

    // Leader Arrow (A1) - Apply easing
    let easedLeaderProgress = this.easeOutDynamic(
      leaderLinearProgress,
      this.delaying_leaderDecelerationFactor
    );
    let posLeaderX = lerp(startX, endX, easedLeaderProgress);

    // Follower Arrow (A2) - Calculate target linear progress, then apply same easing
    let followerTargetLinearProgress = 0;
    if (leaderLinearProgress >= this.delaying_leaderStartProgress) {
      let activeTimeForFollower =
        leaderLinearProgress - this.delaying_leaderStartProgress;
      followerTargetLinearProgress =
        activeTimeForFollower * this.delaying_followerRelativeSpeed;
    }
    // Follower cannot get ahead of leader in linear terms, and cannot be negative
    followerTargetLinearProgress = constrain(
      followerTargetLinearProgress,
      0,
      leaderLinearProgress
    );
    followerTargetLinearProgress = constrain(
      followerTargetLinearProgress,
      0,
      1.0
    ); // General sanity cap at 1.0

    let easedFollowerProgress = this.easeOutDynamic(
      followerTargetLinearProgress,
      this.delaying_leaderDecelerationFactor
    );
    let posFollowerX = lerp(startX, endX, easedFollowerProgress);

    // Determine actual start and end for the wire based on eased positions and direction
    let wireDrawStartX, wireDrawEndX;
    if (directionPhase === 0) {
      // e1 -> e2, startX is 0
      wireDrawStartX = min(posLeaderX, posFollowerX); // Should be posFollowerX if follower is behind
      wireDrawEndX = max(posLeaderX, posFollowerX); // Should be posLeaderX
      // More robustly:
      wireDrawStartX =
        easedFollowerProgress <= easedLeaderProgress
          ? posFollowerX
          : posLeaderX;
      wireDrawEndX =
        easedFollowerProgress <= easedLeaderProgress
          ? posLeaderX
          : posFollowerX;
    } else {
      // e2 -> e1, startX is d
      wireDrawStartX = max(posLeaderX, posFollowerX); // Should be posFollowerX if follower is behind (larger X value)
      wireDrawEndX = min(posLeaderX, posFollowerX); // Should be posLeaderX
      // More robustly:
      wireDrawStartX =
        easedFollowerProgress <= easedLeaderProgress
          ? posFollowerX
          : posLeaderX; // follower has less progress from d, so larger X
      wireDrawEndX =
        easedFollowerProgress <= easedLeaderProgress
          ? posLeaderX
          : posFollowerX; // leader has more progress from d, so smaller X
    }
    // Simplified for drawing: use the calculated positions directly
    // The line function itself doesn't care about order for a simple line.
    let wireDistance = abs(posLeaderX - posFollowerX);

    if (
      this.positivity !== 50 &&
      lineThickness > 0 &&
      wireDistance > lineThickness * 0.5
    ) {
      let glowColorVal;
      let glowOpacity = map(
        abs(this.positivity - 50),
        0,
        50,
        0,
        this.glow_maxOpacity
      );
      if (this.positivity < 50) {
        glowColorVal = color(0, glowOpacity);
      } else {
        glowColorVal = color(
          red(mainCol),
          green(mainCol),
          blue(mainCol),
          glowOpacity
        );
      }

      push();
      stroke(glowColorVal);
      for (let i = this.glow_blurSteps; i >= 1; i--) {
        let currentGlowWeight =
          lineThickness +
          lineThickness *
            (this.glow_sizeFactor - 1) *
            (i / this.glow_blurSteps);
        strokeWeight(currentGlowWeight);
        line(posFollowerX, 0, posLeaderX, 0);
      }
      pop();
    }

    stroke(mainCol);
    strokeWeight(lineThickness);
    line(posFollowerX, 0, posLeaderX, 0);

    this.drawArrow(posLeaderX, 0, arrowAngle, arrowSize, mainCol);
    if (
      followerTargetLinearProgress > 0 ||
      this.delaying_leaderStartProgress === 0
    ) {
      // Draw follower if it should have moved
      this.drawArrow(posFollowerX, 0, arrowAngle, arrowSize, mainCol);
    }

    pop();
  }

  amplifying(p1, p2, d, ang) {
    // This is a placeholder for your existing amplifying logic.
    // It should use p1, p2, d, ang for positioning, and access
    // this.strength, this.relationColor, this.positivity etc.
    // Example:
    // push();
    // translate(p1.x, p1.y);
    // rotate(ang);
    // // Your glow logic for amplifying if specific
    // stroke(this.relationColor);
    // strokeWeight(map(this.strength, 0, 100, 2, 12)); // Example use of strength
    // line(0,0, d,0);
    // // ... more complex visuals ...
    // pop();
  }

  easeOutDynamic(t, factor) {
    if (factor <= 1 || factor === undefined) return t; // Linear if factor is 1 or less, or not provided
    return 1 - pow(1 - constrain(t, 0, 1), factor);
  }
}
