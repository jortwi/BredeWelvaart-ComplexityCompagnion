let elements = []; //array with all elements on screen
let relations = []; //array with relations between all elements (some are invisible)
let selectedA = 0; //index for the selected element under selected A, refers to elements[index] array
let selectedB = 1; //index for the selected element under selected B, refers to elements[index] array
let selectedAorB = "A"; //"A" or "B", specifies wether the user is changing the selected element A or B
let aiMode = "undefined"; //current AI mode
// let aiModes = [          //looks like this is not used
//   "undefined",
//   "criticism",
//   "suggestion",
//   "reflection",
//   "clarification",
//   "conclusion",
// ];
let ai_message = "no message"; //current AI message
let ai_thinking = "false"; //specifies if "thinking" LED should be turned on

//keyBoard Mode
let keyBoardMode = true;
let userIsTyping = false;
let typedText = "";
let finalText = "";

function preload() {
  font = loadFont("../assets/SpaceMono-Bold.ttf");
  backgroundTextureImage = loadImage("/assets/white-rough-texture-pattern.jpg");
}

function setup() {
  let canvas = createCanvas(1440, 720); //not ideal
  canvas.parent("canvas");

  //set cursors start location
  cursor.x = width / 2;
  cursor.y = height / 2;

  textAlign(CENTER, CENTER);
  textFont(font);
  textSize(17);
  //   noStroke();

  //add initial elements to screen (specified in startElements.js, can be adapted by user)
  let startElements = getStartElements();
  for (let i = 0; i < startElements.length; i++) {
    addElement(new Element(startElements[i]));
  }
}

function draw() {
  //color issue: probably an issue with the copying of this.e1.c1. changes to that value pass on. See neutral() function in Relation.js

  background("white");
  tint(255, 50);
  image(backgroundTextureImage, 0, 0, width, height);

  //add unpredictability to the visual
  handleRandomness();

  //first render relations so they stay behind the elements

  //display relations
  for (let i = 0; i < relations.length; i++) {
    relations[i].display();
  }

  //display elements
  for (let i = 0; i < elements.length; i++) {
    elements[i].display();
    elements[i].update();
  }

  //display white spot
  for (let i = 0; i < whiteSpots.length; i++) {
    whiteSpots[i].display();
    whiteSpots[i].update();
  }

  handleInputs();

  updatePreviousButtonStates();

  sendOOCSI();

  drawProgressBar();

  // sensorData.encoder_select;

  // Display typed text only while typing
  if (userIsTyping) {
    text(typedText, width / 2, height - 15);
  }
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
  const payloadCC02 = {};

  // Set true for the selected type, false for all others
  for (const type of allTypes) {
    payloadCC02[type] = type === oocsiTypeString ? "true" : "false";
  }

  OOCSI.send("CC-02", {
    ...payloadCC02,
  });

  OOCSI.send("CC-03", {
    //nothing is sent to CC-03
  });

  const oocsiModeString = getOocsiModeString();
  const allModes = [
    "04_mode_und",
    "04_mode_crit",
    "04_mode_sugg",
    "04_mode_refl",
    "04_mode_clar",
    "04_mode_concl",
  ];
  const payloadCC04 = {};
  for (const mode of allModes) {
    payloadCC04[mode] = mode === oocsiModeString ? "true" : "false";
  }
  OOCSI.send("CC-04", {
    ...payloadCC04,
    "04_oled_msg": ai_message,
    "04_think": ai_thinking,
  });
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
  if (!keyBoardMode) {
    if (sensorData.button_add && !sensorData.prev_button_add) {
      audioSwitch.hold();
    }
    if (!sensorData.button_add && sensorData.prev_button_add) {
      let transcription = await audioSwitch.release();
      addElement(
        new Element({
          x: random(width),
          y: random(height),
          r: 20,
          increment: 0.001,
          c1: color(getColor()),
          c2: color(getColor()),
          name: transcription,
        })
      );
    }
  } else {
    if (sensorData.button_add && !sensorData.prev_button_add) {
      //enter keyboard mode
      if (!userIsTyping) {
        userIsTyping = true;
        typedText = ""; // clear buffer to start fresh
      } else {
        userIsTyping = false;
        finalText = typedText;

        //add element with the final text as name
        addElement(
          new Element({
            x: random(1920),
            y: random(1080),
            r: 20,
            increment: 0.001,
            c1: color(getColor()),
            c2: color(getColor()),
            name: finalText,
          })
        );
      }
    }
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

  //update positivity of relation
  if (
    sensorData.encoder_negative_positive !==
    sensorData.prev_encoder_negative_positive
  ) {
    let difference =
      sensorData.prev_encoder_negative_positive -
      sensorData.encoder_negative_positive;
    selectedRelation.positivity -= difference;
  }

  //update strength of relation
  if (sensorData.encoder_weak_strong !== sensorData.prev_encoder_weak_strong) {
    let difference =
      sensorData.prev_encoder_weak_strong - sensorData.encoder_weak_strong;
    selectedRelation.strength -= difference;
  }

  // --- CC-03 --- //
  //Move UP
  if (sensorData.button_up) {
    //the user may hold the button or press it just once, so no check if previous state was 0
    if (selectedAorB === "A") {
      elements[
        ((selectedA % elements.length) + elements.length) % elements.length
      ].y -= 3;
    } else {
      elements[
        ((selectedB % elements.length) + elements.length) % elements.length
      ].y -= 3;
    }
  }
  //Move RIGHT
  if (sensorData.button_right) {
    //the user may hold the button or press it just once, so no check if previous state was 0
    if (selectedAorB === "A") {
      elements[
        ((selectedA % elements.length) + elements.length) % elements.length
      ].x += 3;
    } else {
      elements[
        ((selectedB % elements.length) + elements.length) % elements.length
      ].x += 3;
    }
  }
  //Move DOWN
  if (sensorData.button_down) {
    //the user may hold the button or press it just once, so no check if previous state was 0
    if (selectedAorB === "A") {
      elements[
        ((selectedA % elements.length) + elements.length) % elements.length
      ].y += 3;
    } else {
      elements[
        ((selectedB % elements.length) + elements.length) % elements.length
      ].y += 3;
    }
  }
  //Move LEFT
  if (sensorData.button_left) {
    //the user may hold the button or press it just once, so no check if previous state was 0
    if (selectedAorB === "A") {
      elements[
        ((selectedA % elements.length) + elements.length) % elements.length
      ].x -= 3;
    } else {
      elements[
        ((selectedB % elements.length) + elements.length) % elements.length
      ].x -= 3;
    }
  }
  //Size Encoder
  if (sensorData.encoder_size !== sensorData.prev_encoder_size) {
    let difference = sensorData.prev_encoder_size - sensorData.encoder_size;
    if (selectedAorB === "A") {
      elements[
        ((selectedA % elements.length) + elements.length) % elements.length
      ].r -= difference;
    } else {
      elements[
        ((selectedB % elements.length) + elements.length) % elements.length
      ].r -= difference;
    }
  }

  // --- CC-04 --- //
  aiMode = calculateMode();
  if (sensorData.button_next && !sensorData.prev_button_next) {
    ai_thinking = "true";
    ai_message = await getAiMessage();
    ai_thinking = "false";
  }

  // --- Keyboard Mode --- //
  if (
    sensorData["_01_rotenc_sw"] &&
    sensorData.button_a &&
    sensorData.button_b &&
    !sensorData.prev_button_a
  ) {
    keyBoardMode = !keyBoardMode;
    console.log("keyBoard Mode: ", keyBoardMode);
  }
}

//Functions with algorithms to find, add, remove, and change elements and relations between those elements correctly
function addElement(newElement) {
  // Create relations with all existing elements
  for (const existingElement of elements) {
    relations.push(new Relation(existingElement, newElement, "null"));
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
    "delaying",
  ];

  const value = 1 - sensorData.knob_type;

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

function getOocsiModeString() {
  switch (aiMode) {
    case "undefined":
      return "04_mode_und";
    case "criticism":
      return "04_mode_crit";
    case "suggestion":
      return "04_mode_sugg";
    case "reflection":
      return "04_mode_refl";
    case "clarification":
      return "04_mode_clar";
    case "conclusion":
      return "04_mode_concl";
  }
}

//retrieve the mode for AI based on what the knob_mode is currently set to
function calculateMode() {
  const modes = [
    "conclusion",
    "clarification",
    "reflection",
    "suggestion",
    "criticism",
    "undefined",
  ];

  const value = 1 - sensorData.knob_mode;

  if (typeof value !== "number" || value < 0 || value > 1) {
    console.error(
      "knob_mode is not a number or not 0-1:",
      JSON.stringify(sensorData.knob_mode)
    );
    return null;
  }

  // Multiply by number of segments and floor it, then clamp
  const index = Math.min(Math.floor(value * modes.length), modes.length - 1);

  return modes[index];
}

function getRandomRelationType() {
  const types = [
    "null",
    "undefined",
    "balancing",
    "amplifying",
    "flow",
    "resonance",
    "delaying",
  ];
  return types[Math.floor(random(types.length))];
}

// --- Typing mode --- //
// Toggle typing mode with any key press
function keyPressed() {
  // Use Enter to toggle typing mode off optionally
  if (keyCode === ENTER) {
    userIsTyping = false;
    finalText = typedText;

    //add element with the final text as name
    addElement(
      new Element({
        x: random(width),
        y: random(height),
        r: 20,
        increment: 0.001,
        c1: color(getColor()),
        c2: color(getColor()),
        name: finalText,
      })
    );

    return false; // prevent default
  }

  // Delete character
  if (userIsTyping && keyCode === BACKSPACE) {
    typedText = typedText.slice(0, -1);
    return false;
  }
}

// Capture characters while typing
function keyTyped() {
  if (userIsTyping && key !== "Enter") {
    typedText += key;
  }
}
