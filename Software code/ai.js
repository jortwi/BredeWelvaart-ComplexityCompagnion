//AI Settings
let model = "deepseek-r1-distill-llama-8b"; //DEEPSEEK R1

//server defined in keys.js
//api_token defined in key.js

async function getAiMessage() {
  let response;
  if (aiMode === "conclusion") {
  } else {
    //add other modes
    //if no mode is provided, use mode === "undefined"
    response = await foundry.textToText({
      server,
      api_token,
      prompt: "please tell me more about broad prosperity. answer VERY shortly",
      logging: true,
      model,
      maxTokens: 9999, //not ideal but neither is cut-off messages
    });
  }
  console.log(extractTextBetweenMarkers(response));
  return extractTextBetweenMarkers(response)[0];
}

function extractTextBetweenMarkers(input) {
  const regex = /<\/think>(.*?)<｜end▁of▁sentence｜>/gs;
  const matches = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1].trim());
  }

  return matches;
}

//record audio
const audioSwitch = {
  recording: false,
  hold: async function () {
    if (this.recording === false) {
      //only start recording when not recording
      this.recording = true;
      foundry.soundToText({
        api_token,
        server,
        type: "record",
        logging: false,
      });
    } else {
      console.error("already recording");
    }
  },
  release: async function () {
    if (this.recording === true) {
      //only stop recording when recording
      let completeTranscription = await foundry.soundToText({
        api_token,
        server,
        stopRec: true,
      });
      this.recording = false;
      return completeTranscription;
    }
  },
};

function getAiInput() {
  let input = {
    topic: "",
    behavior: "",
    prompt: "",
  };

  return JSON.stringify(input);
}
