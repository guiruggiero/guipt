const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} =
  require("@google/generative-ai");
const fs = require("fs");
const {onRequest} = require("firebase-functions/v2/https");

// Initializations
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Gemini variation - https://ai.google.dev/gemini-api/docs/models/gemini
const modelChosen = "gemini-1.5-flash";

// Get prompt instructions from file
const instructions = fs.readFileSync("prompt.txt", "utf8");
// console.log(instructions);

// Model configuration
const generationConfig = {
  temperature: 0.7, // default 1
  topP: 0.95, // default 0.95
  topK: 40, // default 40
  maxOutputTokens: 400,
  responseMimeType: "text/plain",
};

// Model safety settings
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
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Model constructor
const model = genAI.getGenerativeModel({
  model: modelChosen,
  systemInstruction: instructions,
  generationConfig,
  safetySettings,
});

exports.guipt = onRequest({cors: true}, async (request, response) => {
  // Get chat history from request
  let chatHistory = request.query.history;
  if (!chatHistory) {
    chatHistory = [];
  }
  // console.log("chatHistory: " + chatHistory);

  // Initialize the chat
  const chat = model.startChat({history: chatHistory});

  // Get user prompt from request
  let userInput = request.query.prompt;
  if (!userInput) {
    userInput = "Hi, what can you do?";
  }

  // Gemini API call
  const result = await chat.sendMessage(userInput);
  const guiptResponse = await result.response;
  const guiptResponseText = guiptResponse.text();

  // Returns model response back to API caller
  response.send(guiptResponseText);
});
