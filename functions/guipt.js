/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} = require("@google/generative-ai");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");
const {onRequest} = require("firebase-functions/v2/https");

// Initializations
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Gemini variation - https://ai.google.dev/gemini-api/docs/models/gemini
const chosenModel = "gemini-1.5-flash-latest"; // gemini-1.5-flash-8b-latest

// Get system instructions from file
const instructions = fs.readFileSync("prompt.txt", "utf8");

// Model configuration
const generationConfig = {
  temperature: 0.4, // default 1
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
  model: chosenModel,
  systemInstruction: instructions,
  generationConfig,
  safetySettings,
});

// Sanitize potentially harmful characters
function sanitizeInput(input) {
  let sanitizedInput = input.replace(/[\s\t\r\n]+/g, " "); // Normalize whitespace
  sanitizedInput = sanitizedInput.trim(); // Remove whitespace from both ends
  sanitizedInput = sanitizeHtml(sanitizedInput, { // Remove HTML tags and attributes
    allowedTags: [],
    allowedAttributes: {},
  });

  return sanitizedInput;
}

// Assess guardrails
function validateInput(input) {
  // Length limit
  if (input.length > 200) {
    return "⚠️ Oops! Your message is too long, please make it shorter.";
  }

  // Character set
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,!?;:'’"()-]+$/.test(input)) { // Excludes @$%&/+
    return "⚠️ Oops! Please use only letters, numbers, and common punctuation.";
  }

  return "OK";
}

exports.guipt = onRequest({cors: true}, async (request, response) => {
  // Get user prompt from request
  let userInput = request.query.prompt;
  if (!userInput || userInput == " ") {
    userInput = "Hi! Briefly, who are you and what can you do?";
  }

  // Sanitize and validate input
  const sanitizedInput = sanitizeInput(userInput);
  const validationResult = validateInput(sanitizedInput);

  if (validationResult == "OK") {
    // Get chat history from request
    let chatHistory = request.query.history;
    if (!chatHistory) {
      chatHistory = [];
    }

    // Initialize the chat
    const chat = model.startChat({history: chatHistory});

    // Gemini API call
    const result = await chat.sendMessage(sanitizedInput);
    const guiptResponse = result.response.text();

    // Returns model response back to API caller
    response.send(guiptResponse);
  } else {
    response.send(validationResult);
  }
});
