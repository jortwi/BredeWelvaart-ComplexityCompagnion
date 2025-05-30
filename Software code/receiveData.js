// --- Constant Variables --- //
const RAW_POT_MAX = 7200;

// --- Data Storage --- //
//The values starting with _0 are directly from OOCSI. Other values are processed
let sensorData = {
  // --- Unprocessed Sensor Data --- //
  //CC-01
  _01_refl_inn: 0,
  _01_refl_thi: 0,
  _01_a: 0,
  _01_b: 0,
  _01_add: 0,
  _01_rem: 0,
  _01_sel: 0,

  //CC-02
  _02_refl_fut: 0,
  _02_refl_eff: 0,
  _02_type: 0,
  _02_neg_pos: 0,
  _02_weak_str: 0,
  _02_set: 0,

  //CC-03
  _03_refl_soc: 0,
  _03_refl_life: 0,
  _03_unce: 0,
  _03_vit: 0,
  _03_size: 0,
  _03_up: 0,
  _03_right: 0,
  _03_down: 0,
  _03_left: 0,

  //CC-04
  _04_refl_col: 0,
  _04_refl_list: 0,
  _04_mode: 0,
  _04_next: 0,

  // --- Processed Sensor Data --- //
  //CC-01
  reflecting_innovation: 0,
  reflecting_interdisciplinary_thinking: 0,
  button_a: 0,
  button_b: 0,
  button_add: 0,
  button_remove: 0,
  encoder_select: 0,

  //CC-02
  reflecting_futures: 0,
  reflecting_effects_elsewhere: 0,
  encoder_weak_strong: 0,
  encoder_negative_positive: 0,
  knob_type: 0,
  button_set: 0,

  //CC-03
  reflecting_quality_of_society: 0,
  reflecting_quality_of_life: 0,
  knob_uncertainty: 0,
  knob_vitality: 0,
  encoder_size: 0,
  button_up: 0,
  button_right: 0,
  button_left: 0,
  button_down: 0,

  //CC-04
  reflecting_collaboration: 0,
  reflecting_listening: 0,
  knob_mode: 0,
  button_next: 0,

  // --- Previous States --- //
  //CC-01
  prev_button_a: 0,
  prev_button_b: 0,
  prev_button_add: 0,
  prev_button_remove: 0,
  prev_encoder_select: 0,

  //CC-02
  prev_encoder_weak_strong: 0,
  prev_encoder_negative_positive: 0,
  prev_button_set: 0,

  //CC-03
  prev_button_up: 0,
  prev_button_right: 0,
  prev_button_down: 0,
  prev_button_left: 0,
  prev_encoder_size: 0,

  //CC-04
  prev_button_next: 0,
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

OOCSI.subscribe("CC-02", function (msg) {
  retrievePotmeter("02_refl_fut", "reflecting_futures", msg);
  retrievePotmeter("02_refl_eff", "reflecting_effects_elsewhere", msg);
  retrievePotmeter("02_type", "knob_type", msg);
  retrieveEncoder("02_neg_pos", "encoder_negative_positive", msg);
  retrieveEncoder("02_weak_str", "encoder_weak_strong", msg);
  retrieveButton("02_set", "button_set", msg);
});

OOCSI.subscribe("CC-03", function (msg) {
  retrievePotmeter("03_refl_soc", "reflecting_quality_of_society", msg);
  retrievePotmeter("03_refl_life", "reflecting_quality_of_life", msg);
  retrievePotmeter("03_unce", "knob_uncertainty", msg);
  retrievePotmeter("03_vit", "knob_vitality", msg);
  retrieveEncoder("03_size", "encoder_size", msg);
  retrieveButton("03_up", "button_up", msg);
  retrieveButton("03_right", "button_right", msg);
  retrieveButton("03_down", "button_down", msg);
  retrieveButton("03_left", "button_left", msg);
});

OOCSI.subscribe("CC-04", function (msg) {
  retrievePotmeter("04_refl_col", "reflecting_collaboration", msg);
  retrievePotmeter("04_refl_lis", "reflecting_listening", msg);
  retrievePotmeter("04_mode", "knob_mode", msg);
  retrieveEncoder("04_next", "button_next", msg);
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
  return constrain(map(rawValue, 0, maxRaw, 1, 0), 0, 1);
}

function updatePreviousButtonStates() {
  //CC-01
  sensorData.prev_button_a = sensorData.button_a;
  sensorData.prev_button_b = sensorData.button_b;
  sensorData.prev_button_add = sensorData.button_add;
  sensorData.prev_button_remove = sensorData.button_remove;
  sensorData.prev_encoder_select = sensorData.encoder_select;

  //CC-02
  sensorData.prev_button_set = sensorData.button_set;
  sensorData.prev_encoder_negative_positive =
    sensorData.encoder_negative_positive;
  sensorData.prev_encoder_weak_strong = sensorData.encoder_weak_strong;

  //CC-03
  sensorData.prev_button_up = sensorData.button_up;
  sensorData.prev_button_right = sensorData.button_right;
  sensorData.prev_button_down = sensorData.button_down;
  sensorData.prev_button_left = sensorData.button_left;
  sensorData.prev_encoder_size = sensorData.encoder_size;

  //CC-04
  sensorData.button_next = sensorData.prev_button_next;
}
