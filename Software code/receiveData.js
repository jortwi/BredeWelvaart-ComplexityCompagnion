// --- Constant Variables --- //
const RAW_POT_MAX = 7200;

// --- Data Storage --- //
//The values starting with _0 are directly from OOCSI. Other values are processed
let sensorData = {
  //unprocessed sensor data
  //CC-01
  _01_refl_inn: 0,
  _01_refl_thi: 0,
  _01_a: 0,
  _01_b: 0,
  _01_add: 0,
  _01_rem: 0,
  _01_sel: 0,
  //CC-02
  //CC-03
  //CC-04

  //processed sensor data
  //CC-01
  reflecting_innovation: 0,
  reflecting_interdisciplinary_thinking: 0,
  button_a: 0,
  button_b: 0,
  button_add: 0,
  button_remove: 0,
  encoder_select: 0,
  //CC-02
  //CC-03
  //CC-04

  //previous states
  //CC-01
  prev_button_a: 0,
  prev_button_b: 0,
  prev_button_add: 0,
  prev_button_remove: 0,
  prev_encoder_select: 0,
  //CC-02
  //CC-03
  //CC-04
};

OOCSI.connect("wss://oocsi.id.tue.nl/ws");
OOCSI.subscribe("CC-01", function (msg) {
  retrievePotmeter("01_refl_inn", "reflecting_innovation", msg);
  retrievePotmeter("01_refl_thi", "reflecting_interdisciplinary_thinking", msg);
  retrieveButton("01_a", "button_a", msg);
  retrieveButton("01_b", "button_b", msg);
  retrieveButton("01_add", "button_add", msg);
  retrieveButton("01_rem", "button_remove", msg);
  retrieveEncoder("01_sel", "encoder_select", msg);
});

function retrievePotmeter(oocsiName, jsName, msg) {
  sensorData["_" + oocsiName] = msg.data[oocsiName];
  sensorData[jsName] = processPotentiometer(
    sensorData["_" + oocsiName],
    RAW_POT_MAX
  );
}

function retrieveButton(oocsiName, jsName, msg) {
  sensorData["_" + oocsiName] = msg.data[oocsiName];
  sensorData[jsName] = sensorData["_" + oocsiName];
}

function retrieveEncoder(oocsiName, jsName, msg) {
  sensorData["_" + oocsiName] = msg.data[oocsiName];
  sensorData[jsName] = sensorData["_" + oocsiName];
}

// Map raw 0-max potentiometer value to 0-1
function processPotentiometer(rawValue, maxRaw) {
  return constrain(map(rawValue, 0, maxRaw, 0, 1), 0, 1);
}

function updatePreviousButtonStates() {
  sensorData.prev_button_a = sensorData.button_a;
  sensorData.prev_button_b = sensorData.button_b;
  sensorData.prev_button_add = sensorData.button_add;
  sensorData.prev_button_remove = sensorData.button_remove;
  sensorData.prev_encoder_select = sensorData.encoder_select;
}
