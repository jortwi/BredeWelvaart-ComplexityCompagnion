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
      prompt: getAiInput(),
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
    prompt: `
     GIVE A VERY SHORT SUPPORTIVE STATEMENT. MAX 2 SENTENCES!!!! THIS IS EXTREMELY IMPORTANT. 
     CONSIDER YOUR READER TO BE INTELLIGENT AND KNOWLEDGEABLE.
     You help the readers to collaborate and discuss a complex topic. Change your reaction according to the specified behavior.
     Take into account your own behavior, the topic information, the reflections provided by the users, and the situation analysis provided by the user.
     Help the users by provided missed opportunities or insights, by asking smart questions,
     by asking them to reflect on certain ideas, or by helping them conclude on their thoughts.
     In this discussion the users are visualizing how they think the elements in the situation relate to each other, you can help them.
     YOU DO NOT GIVE ANSWERS, YOU ARE ONLY HERE TO SUPPORT.
     IGNORE THAT THE REFLECTIONS ARE GIVEN VERY SPECIFICALLY, AND USE THIS INFORMATION AS A SUGGESTION.
     IGNORE ALL TEXT THAT IS NOT ENGLISH OR DUTCH!!!!!!
    `,
    situationAnalysis: `
      Important elements though of by the users: ${getElements()}.
      The users rate the uncertainty of their situation on a scale of 0 - 1 a: ${
        sensorData.knob_uncertainty
      }.
      The users rate the vitality of their situation on a scale of 0 - 1 a: ${
        sensorData.knob_vitality
      }
    `,
    usersReflection: `
    The users rated their discussion and situational analysis on the following scales from 0 - 1:
    innovation: ${sensorData.reflecting_innovation},
    interdisciplinary thinking: ${sensorData.reflecting_interdisciplinary_thinking},
    futures: ${sensorData.reflecting_futures},
    effects elsewhere / side-effects: ${sensorData.reflecting_effects_elsewhere},
    quality of society: ${sensorData.reflecting_quality_of_society},
    quality of life: ${sensorData.reflecting_quality_of_life},
    collaboration: ${sensorData.reflecting_collaboration},
    listening to each other: ${sensorData.reflecting_listening},
    `,
    topicInformation: `
      You currently do not have specific information about the topic, but you do have information that is relevant about broad prosperity:
      Broad Prosperity is used as a framework for reflecting on the situation. It includes everything that people value in life.
      Promote thinking in terms of broad prosperity, meaning thinking differently, regular reflection, learning, innovating, considering all perspectives,
      and especially considering effects elsewhere and effects in the future.
    `,
    behavior: `
      ${aiMode}
    `,
  };

  return JSON.stringify(input);
}

function getElements() {
  let elementNames = [];
  for (let i = 0; i < elements.length; i++) {
    elementNames.push(elements[i].name);
  }
  return elementNames;
}
