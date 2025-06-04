//AI Settings
let model = "deepseek-r1-distill-llama-8b"; //DEEPSEEK R1
let aiMessageList = [];

async function getAiMessage() {
  //in USER settings, a choice can be made between private and commercial AI
  if (useLocalAI) {
    let response;

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

    console.log(extractTextBetweenMarkers(response));
    return extractTextBetweenMarkers(response)[0];
  } else {
    let response = await runGemini(getAiInput());
    aiMessageList.push(response);
    return response;
  }
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
  let aiInputList = returnAiInputList();
  // return JSON.stringify(input);
  return `
  PROMPT: ${aiInputList.prompt}
  ---
  SITUATION ANALYSIS: ${aiInputList.situationAnalysis}
  ---
  USER REFLECTION: ${aiInputList.usersReflection}
  ---
  TOPIC INFORMATION: ${aiInputList.topicInformation}
  ---
  BEHAVIOR: ${aiMode}
  `;
}

function getElements() {
  let elementNames = [];
  for (let i = 0; i < elements.length; i++) {
    elementNames.push(elements[i].name);
  }
  return elementNames;
}

async function getAiSessionSummary() {
  let aiInputList = returnAiInputList();
  let prompt = `
    PROMPT: 
    Write a short summary of the session. The session has been a discussion between a small group of people where they collaboratively visualized a complex topic.
    You don't know exactly what happened, so only write things you are sure about. Consider your reader to be part of the group and thus already knowledgeable.
    Take into account the topic information, reflections provided by the users, and the situation analysis provided by the users. 
    In this discussion the users are visualizing how they think the elements in the situation relate to each other.
    Do not give unnessecary information, introductions, suggestions, fun talk, or other unrelated text that an AI might give. You are only providing the summary,
    so you will not respond to this prompt directly. You only return the summary I asked for.
    Adress the users as "you" instead of "the group".
    First remind them of the topic, then refer to the elements and relations they added. Finally tell them a bit about their reflections.
    Round any numbers to one decimal
    ---
    Topic:
    ${aiInputList.topicInformation}
    ---
    Situation Analysis:
    ${aiInputList.situationAnalysisWithoutUncertaintyAndVitality}
    ---
    User Reflections:
    ${aiInputList.usersReflection}
  `;
  if (useLocalAI) {
    let response;

    //add other modes
    //if no mode is provided, use mode === "undefined"
    response = await foundry.textToText({
      server,
      api_token,
      prompt: prompt,
      logging: true,
      model,
      maxTokens: 9999, //not ideal but neither is cut-off messages
    });

    console.log(extractTextBetweenMarkers(response));
    return extractTextBetweenMarkers(response)[0];
  } else {
    let response = await runGemini(prompt);
    aiMessageList.push(response);
    return response;
  }
}

function returnAiInputList() {
  let includeRelations = "";
  for (let i = 0; i < relations.length; i++) {
    if (relations[i].type != "null") {
      includeRelations += `There was a ${relations[i].type} relation between ${relations[i].e1.name} and ${relations[i].e2.name}. `;
    }
  }

  return {
    prompt: `
     GIVE A VERY SHORT SUPPORTIVE STATEMENT. MAX 1 SHORT SENTENCE!!!! THIS IS EXTREMELY IMPORTANT. DO NOT INTRODUCE THE TOPIC OR GIVE COMPLIMENTS. 
     CONSIDER YOUR READER TO BE INTELLIGENT AND KNOWLEDGEABLE. IT IS A BIG PROBLEM IF YOUR RESPONSE IS TOO LONG. DO NOT USE LISTS, NO INTRODUCTION. NO ACKNOWLEDGEMENTS.
     You help the readers to collaborate and discuss a complex topic. Change your reaction according to the specified behavior.
     Take into account your own behavior, the topic information, the reflections provided by the users, and the situation analysis provided by the user.
     Help the users by provided missed opportunities or insights, by asking smart questions,
     by asking them to reflect on certain ideas, or by helping them conclude on their thoughts.
     In this discussion the users are visualizing how they think the elements in the situation relate to each other, you can help them.
     YOU DO NOT GIVE ANSWERS, YOU ARE ONLY HERE TO SUPPORT.
     IGNORE THAT THE REFLECTIONS ARE GIVEN VERY SPECIFICALLY, AND USE THIS INFORMATION AS A SUGGESTION.
     IGNORE ALL TEXT THAT IS NOT ENGLISH OR DUTCH!!!!!!

     EACH RESPONSE MUST BE SPECIFIC TO THE INFORMATION YOU HAVE ABOUT THE TOPIC, ANALYSIS, and USER REFLECTIONS. SIMPLE AND GENERAL COMMENTS ARE NOT ALLOWED.
     
     Example responses:
     - Reflect on how you could think outside your own disciplines.
     - Would it be a good idea to add "Education" as an element?
     - Do you fully understand the mechanisms of the relation between "Housing" and "Elderly"?
     - Reflect on how you could innovate more together
    `,
    situationAnalysis: `
      Important elements though of by the users: ${getElements()}.
      ${includeRelations}
      The users rate the uncertainty of their situation on a scale of 0 - 1 a: ${
        sensorData.knob_uncertainty
      }.
      The users rate the vitality of their situation on a scale of 0 - 1 a: ${
        sensorData.knob_vitality
      }
    `,
    situationAnalysisWithoutUncertaintyAndVitality: `
     Important elements though of by the users: ${getElements()}.
      ${includeRelations}
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
      Information that is relevant about broad prosperity:
      Broad Prosperity is used as a framework for reflecting on the situation. It includes everything that people value in life.
      Promote thinking in terms of broad prosperity, meaning thinking differently, regular reflection, learning, innovating, considering all perspectives,
      and especially considering effects elsewhere and effects in the future.

      Topic information: ${backgroundInformation}
    `,
    behavior: `
      ${aiMode}. Really take this mode seriously and completely adapt your behavior to this behavior mode. THIS IS REALLY IMPORTANT!!
      An explanation of the different behavior modes:
      undefined: say anything relevant.
      criticism: give criticism to the work created by the users or note their reflections that could improve.
      suggestion: give a specific suggestion for a specific change or addition.
      reflection: ask the users a question that helps them reflect on their own behavior, not on the situation.
      clarification: ask for clarification on something in the situational analysis
      conclusions: ask a question that helps the users conclude on their analysis.
    `,
  };
}
