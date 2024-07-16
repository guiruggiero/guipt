const {onRequest} = require("firebase-functions/v2/https");
const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} =
  require("@google/generative-ai");
const fs = require("fs");

// Initializations
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Model setup
// const modelChosen = "gemini-1.5-pro";
const modelChosen = "gemini-1.5-flash";
// const modelChosen = "gemini-1.0-pro";

const instructions = fs.readFileSync("prompt.txt", "utf8");
// console.log(instructions);

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

// TODO: remove cors to protect invocation?
exports.guipt = onRequest({cors: true}, async (request, response) => {
  // Gets chat history from request
  let chatHistory = request.query.history;
  if (!chatHistory) {
    chatHistory = [];
  }
  // console.log("chatHistory: " + chatHistory);

  // Initializes the chat
  const chat = model.startChat({history: chatHistory});

  // Gets user prompt from request
  let userInput = request.query.prompt;
  if (!userInput) {
    userInput = "Hi, what can you do?";
  }

  // Sends user prompt and gets model response
  const result = await chat.sendMessage(userInput);
  const guiptResponse = await result.response;
  const guiptResponseText = guiptResponse.text();

  // Returns model response back to API caller
  response.send(guiptResponseText);
});

// --

const {onSchedule} = require("firebase-functions/v2/scheduler");
const jsdom = require("jsdom");
const {htmlToText} = require("html-to-text");

const url = process.env.PROMPT_URL;

// Run once a day at midnight, for manual run: https://console.cloud.google.com/cloudscheduler
exports.updatePrompt = onSchedule("every day 00:00", async (event) => {
  const response = await fetch(url);
  const document = await response.text();

  const dom = new jsdom.JSDOM(document);
  const contentHTML = dom.window.document.
      querySelectorAll("div.doc-content")[0].innerHTML;

  const contentText = htmlToText(contentHTML, {wordwrap: null});
  const contentTextClean = contentText.replace(/\n{2,}/g, "\n");

  fs.writeFileSync("prompt.txt", contentTextClean, "utf-8", (error) => {
    if (error) {
      console.error(error);
    }
  });
});
