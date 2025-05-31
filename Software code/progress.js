function drawProgressBar() {
  push();
  rectMode(CENTER);
  textAlign(LEFT, BOTTOM);
  stroke("#282828");
  strokeWeight(2);
  noFill();

  // Dimensions
  let barWidth = (width / 10) * 8;
  let barHeight = height / 20;
  let barCenterX = width / 2;
  let barY = height - barHeight;

  // Draw border box (centered)
  rect(barCenterX, barY, barWidth, barHeight);

  // Compute progress value (clamped)
  let progress = constrain(
    (sensorData.reflecting_innovation +
      sensorData.reflecting_interdisciplinary_thinking +
      sensorData.reflecting_futures +
      sensorData.reflecting_effects_elsewhere +
      sensorData.reflecting_quality_of_society +
      sensorData.reflecting_quality_of_life +
      sensorData.reflecting_collaboration +
      sensorData.reflecting_listening) /
      8,
    0,
    1
  );

  // Draw progress bar fill — from the LEFT edge of the border
  rectMode(CORNER); // makes x,y the top-left corner
  fill("#282828");
  let leftX = barCenterX - barWidth / 2;
  rect(leftX, barY - barHeight / 2, progress * barWidth, barHeight); // shift y to align top-left

  // Label above the box
  noStroke();
  fill("#282828");
  let labelY = barY - barHeight / 2 - 8; // 8 pixels above the top of the border
  text("Reflected Broad Prosperity Progress", leftX, labelY);

  // Draw 80% marker line ("Conclusion Mode")
  let markerX = leftX + 0.8 * barWidth;
  stroke("#282828"); // red line for visibility
  strokeWeight(1);
  line(markerX, barY - barHeight / 2 - 5, markerX, barY + barHeight / 2 + 5); // vertical line through bar

  // Draw label
  noStroke();
  fill("#282828");
  textAlign(LEFT, BOTTOM);
  text("Conclusion Mode", markerX + 5, barY - barHeight / 2 - 4); // slightly above and right of line

  pop();
}
