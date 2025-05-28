let elements = [];
let selectedA = 0;
let selectedB = 1;
let selectedAorB = "A";

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

  elements.push(
    new Element(
      width / 2,
      height / 2,
      50,
      0.001,
      color("red"),
      color("white"),
      "Transforming Practices"
    )
  );
  elements.push(
    new Element(
      width / 3,
      height / 3,
      30,
      0.001,
      color("navy"),
      color("#1100FF"),
      "Algemene Rekenkamer"
    )
  );
  elements.push(
    new Element(
      1700,
      800,
      40,
      0.001,
      color("#DDBEA9"),
      color("#F7DECA"),
      "Eindhoven"
    )
  );

  r1 = new Relation(elements[0], elements[1], "amplifying");
  r2 = new Relation(elements[1], elements[2], "neutral");
  r3 = new Relation(elements[2], elements[0], "undefined");
}

function draw() {
  //color issue: probably an issue with the copying of this.e1.c1. changes to that value pass on. See neutral() function in Relation.js

  background("white");

  //first render relations so they stay behind the elements
  r1.display();
  r2.display();
  r3.display();

  for (let i = 0; i < elements.length; i++) {
    elements[i].display();
    elements[i].update();
  }

  handleInputs();

  updatePreviousButtonStates();

  sendOOCSI();

  sensorData.encoder_select;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function sendOOCSI() {
  OOCSI.send("CC-01", {
    "01_oled_a":
      elements[
        ((selectedA % elements.length) + elements.length) % elements.length
      ]?.name, //select element name value correctly
    "01_oled_b":
      elements[
        ((selectedB % elements.length) + elements.length) % elements.length
      ]?.name,
    "01_oled_sel": selectedAorB,
  });

  OOCSI.send("CC-02", {});
  OOCSI.send("CC-03", {});
  OOCSI.send("CC-04", {});
}

function handleInputs() {
  //CC-01
  //Update information on which (A or B) should be highlighted on screen --> move this to arduino internally
  if (sensorData.button_a && !sensorData.prev_button_a) {
    selectedAorB = "A";
  } else if (sensorData.button_b && !sensorData.prev_button_b) {
    selectedAorB = "B";
  }

  //cycle through elements for either A or B

  if (sensorData.encoder_select !== sensorData.prev_encoder_select) {
    //use the change in the encoder
    let difference = sensorData.encoder_select - sensorData.prev_encoder_select;
    if (selectedAorB === "A") {
      selectedA += difference;
    } else {
      selectedB += difference;
    }
  }
}
