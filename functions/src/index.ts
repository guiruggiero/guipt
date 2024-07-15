import {onRequest} from "firebase-functions/v2/https";

import * as fs from "fs";
const instructions = fs.readFileSync("prompt.txt", "utf8");

import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold}
  from "@google/generative-ai";
const apiKey:string = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

// const modelChosen = "gemini-1.5-pro";
const modelChosen = "gemini-1.5-flash";
// const modelChosen = "gemini-1.0-pro";

const generationConfig = {
  temperature: 0.7, // default 1
  topP: 0.95, // default 0.95
  topK: 40, // default 40
  maxOutputTokens: 400,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const model = genAI.getGenerativeModel({
  model: modelChosen,
  systemInstruction: instructions,
  generationConfig,
  safetySettings,
});

exports.guipt = onRequest({cors: true}, async (request, response) => {
  let chatHistory = request.query.history;
  if (!chatHistory) {
    chatHistory = [];
  }
  // console.log(history);

  let userInput = request.query.prompt;
  if (!userInput) {
    userInput = "Hi";
  }
  // console.log(prompt_user);

  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(userInput);
  const guiptResponse = await result.response;
  const guiptResponseText = guiptResponse.text();

  response.send(guiptResponseText);
});
