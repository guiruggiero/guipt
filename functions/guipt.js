const Sentry = require("@sentry/node");
const fs = require("fs");
const {HarmCategory, HarmBlockThreshold, GoogleGenerativeAI} = require("@google/generative-ai");
const sanitizeHtml = require("sanitize-html");
const {onRequest} = require("firebase-functions/v2/https");

// Initializations
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Get system instructions from file
const instructions = fs.readFileSync("prompt.txt", "utf8");

// Gemini variation - https://ai.google.dev/gemini-api/docs/models/gemini
const chosenModel = "gemini-2.0-flash-lite";

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
};

// Assess guardrails
function validateInput(input) {
  // Length limit
  if (input.length > 200) return "⚠️ Would you mind shortening your message a bit, please?";

  // Character set - excludes @$%&/+
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,!?;:'’"()-]+$/.test(input)) return "⚠️ Please use only letters, numbers, and common punctuation.";

  return "OK";
};

exports.guipt = onRequest({cors: true, timeoutSeconds: 20}, async (request, response) => {
  // Get user prompt from request
  let userInput = request.query.prompt;
  if (!userInput || userInput == " ") userInput = "Hi! Briefly, who are you and what can you do?";

  // Sanitize and validate input
  const sanitizedInput = sanitizeInput(userInput);
  const validationResult = validateInput(sanitizedInput);

  // Return error message if input doesn't pass validation
  if (validationResult !== "OK") {
    response.send(validationResult);
    return;
  }

  // Get chat history and initialize chat
  let chatHistory = request.query.history;
  if (!chatHistory) chatHistory = [];
  const chat = model.startChat({history: chatHistory});

  try{
    // Call Gemini API and send response back
    const result = await chat.sendMessage(sanitizedInput);
    const guiptResponse = result.response.text();
    response.send(guiptResponse);
  
  } catch (error) {
    // Capture error with request details as extra context
    Sentry.captureException(error, {contexts: {
      input: userInput,
      input_length: userInput.length,
      sanitized_input: sanitizedInput,
      sanitized_input_length: sanitizedInput.length,
      validation_result: validationResult,
      chat_history: chatHistory,
    }});

    // Log error details
    if (error.name == "GoogleGenerativeAIError") console.error(`Gemini API - ${error.message}:`, error);
    else console.error(error);
    
    // Send error before function terminates
    await Sentry.flush(1000);
    
    throw error;
  }
});