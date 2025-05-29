let elements = [];
let relations = [];
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

  addElement(
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
  addElement(
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
  addElement(
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

  // r1 = new Relation(elements[0], elements[1], "amplifying");
  // r2 = new Relation(elements[1], elements[2], "undefined");
  // r3 = new Relation(elements[2], elements[0], "null"); //no relation
}

function draw() {
  //color issue: probably an issue with the copying of this.e1.c1. changes to that value pass on. See neutral() function in Relation.js

  background("white");

  //first render relations so they stay behind the elements
  // r1.display();
  // r2.display();
  // r3.display();

  //display relations
  for (let i = 0; i < relations.length; i++) {
    relations[i].display();
  }

  //display elements
  for (let i = 0; i < elements.length; i++) {
    elements[i].display();
    elements[i].update();
  }

  handleInputs();

  updatePreviousButtonStates();

  sendOOCSI();

  // sensorData.encoder_select;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function sendOOCSI() {
  //CC-01
  let sendRecording = audioSwitch.recording ? "true" : "false";
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
    "01_rec": sendRecording, //send information if the "recording" led should be on or not
  });

  //CC-02
  const oocsiTypeString = getOocsiTypeString();
  const allTypes = [
    "02_type_flow",
    "02_type_rein",
    "02_type_res",
    "02_type_bal",
    "02_type_del",
    "02_type_und",
    "02_type_nor",
  ];
  const payload = {};

  // Set true for the selected type, false for all others
  for (const type of allTypes) {
    payload[type] = type === oocsiTypeString ? "true" : "false";
  }

  OOCSI.send("CC-02", {
    ...payload,
  });
  OOCSI.send("CC-03", {});
  OOCSI.send("CC-04", {});
}

async function handleInputs() {
  // --- CC-01 --- //
  //Update information on which (A or B) should be highlighted on screen --> move this to arduino internally
  if (sensorData.button_a && !sensorData.prev_button_a) {
    selectedAorB = "A";
  } else if (sensorData.button_b && !sensorData.prev_button_b) {
    selectedAorB = "B";
  }

  //Cycle through elements for either A or B
  if (sensorData.encoder_select !== sensorData.prev_encoder_select) {
    //use the change in the encoder
    let difference = sensorData.encoder_select - sensorData.prev_encoder_select;
    if (selectedAorB === "A") {
      selectedA += difference;
    } else {
      selectedB += difference;
    }
  }

  //Record and transcribe while holding Add button
  if (sensorData.button_add && !sensorData.prev_button_add) {
    audioSwitch.hold();
  }
  if (!sensorData.button_add && sensorData.prev_button_add) {
    let transcription = await audioSwitch.release();
    addElement(
      new Element(
        random(1920),
        random(1080),
        50,
        0.001,
        color("#DDBEA9"),
        color("#F7DECA"),
        transcription
      )
    );
  }

  //Remove selected element when Remove button is pressed
  if (sensorData.button_remove && !sensorData.prev_button_remove) {
    if (selectedAorB === "A") {
      removeElement(
        ((selectedA % elements.length) + elements.length) % elements.length
      );
    } else {
      removeElement(
        ((selectedB % elements.length) + elements.length) % elements.length
      );
    }
    console.log(elements);
  }

  // --- CC-02 --- //
  //Retrieve the selected relation between the two selected elements
  let selectedRelation = findRelation(
    //set index correctly
    ((selectedA % elements.length) + elements.length) % elements.length,
    ((selectedB % elements.length) + elements.length) % elements.length
  );
  if (sensorData.button_set && sensorData.prev_button_set) {
    selectedRelation.type = calculateType();
  }
  if (
    sensorData.encoder_negative_positive !==
    sensorData.prev_encoder_negative_positive
  ) {
    let difference =
      sensorData.prev_encoder_negative_positive -
      sensorData.encoder_negative_positive;
    selectedRelation.positivity += difference;
  }
  //here
  if (sensorData.encoder_weak_strong !== sensorData.prev_encoder_weak_strong) {
    let difference =
      sensorData.prev_encoder_negative_positive -
      sensorData.encoder_negative_positive;
    selectedRelation.positivity += difference;
  }
}

//Functions with algorithms to find, add, remove, and change elements and relations between those elements correctly
function addElement(newElement) {
  // Create relations with all existing elements
  for (const existingElement of elements) {
    relations.push(new Relation(existingElement, newElement, "amplifying"));
  }

  // Add the new element to the elements array
  elements.push(newElement);
}

// Remove an element and all related relations
function removeElement(elementToRemove) {
  // Remove all relations involving the element
  for (let i = relations.length - 1; i >= 0; i--) {
    const r = relations[i];
    if (
      r.e1 === elements[elementToRemove] ||
      r.e2 === elements[elementToRemove]
    ) {
      relations.splice(i, 1);
    }
  }

  // Remove from elements array
  const index = elementToRemove;
  if (index !== -1) {
    elements.splice(index, 1);
  }
}

//function to retreive the relation for two elements
function findRelation(element1, element2) {
  return relations.find(
    (r) =>
      (r.e1 === elements[element1] && r.e2 === elements[element2]) ||
      (r.e1 === elements[element2] && r.e2 === elements[element1])
  );
}

//retrieve the type of relation the knob_type is currently set to
function calculateType() {
  const types = [
    "null",
    "undefined",
    "balancing",
    "amplifying",
    "flow",
    "resonance",
    "delay",
  ];

  const value = sensorData.knob_type;

  if (typeof value !== "number" || value < 0 || value > 1) {
    console.error(
      "knob_type is not a number or not 0-1:",
      JSON.stringify(sensorData.knob_type)
    );
    return null;
  }

  const step = 1 / (types.length - 1); // divide range into equal steps
  const index = Math.floor(value / step);

  // Ensure index is within bounds
  return types[Math.min(index, types.length - 1)];
}

function getOocsiTypeString() {
  const relation = findRelation(
    ((selectedA % elements.length) + elements.length) % elements.length,
    ((selectedB % elements.length) + elements.length) % elements.length
  );
  if (!relation || typeof relation.type !== "string") {
    return "02_type_nor"; // fallback if relation or type is missing
  }

  switch (relation.type) {
    case "flow":
      return "02_type_flow";
    case "amplifying":
      return "02_type_rein";
    case "resonance":
      return "02_type_res";
    case "balancing":
      return "02_type_bal";
    case "delay":
      return "02_type_del";
    case "undefined":
      return "02_type_und";
    case "null":
    default:
      return "02_type_nor";
  }
}
