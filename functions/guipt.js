const Sentry = require("@sentry/node");
const fs = require("fs");
const {GoogleGenAI} = require("@google/genai");
const sanitizeHtml = require("sanitize-html");
const {onRequest} = require("firebase-functions/v2/https");

// Initializations
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: apiKey});

// Get system instructions from file
const instructions = fs.readFileSync("prompt.txt", "utf8");

// Model safety settings
const safetySettings = [
  {category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE"},
  {category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE"},
  {category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE"},
  {category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE"},
];

// Model configuration
const modelConfig = {
  model: "gemini-2.0-flash-lite",
  config: {
    systemInstruction: instructions,
    temperature: 0.4,
    maxOutputTokens: 400,
    responseMimeType: "text/plain",
    safetySettings: safetySettings,
  },
};

// Sanitize potentially harmful characters
function sanitizeInput(input) {
  let sanitizedInput = input.replace(/\s+/g, " "); // Normalize whitespace
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

  // Get chat history
  let chatHistory = request.query.history;
  if (!chatHistory) chatHistory = [];

  // Create a new config object with chat history
  const chatConfigWithHistory = {
    ...modelConfig,
    history: chatHistory,
  };
  
  // Initialize chat
  const chat = ai.chats.create(chatConfigWithHistory);

  try{
    // Call Gemini API and send response back
    const result = await chat.sendMessage({message: sanitizedInput});
    const guiptResponse = result.text;
    response.send(guiptResponse);
  
  } catch (error) {
    // Capture error with request details as context
    Sentry.captureException(error, {contexts: {
      turnDetails: {
        userInput: userInput,
        userInputLength: userInput.length,
        sanitizedInput: sanitizedInput,
        sanitizedInputLength: sanitizedInput.length,
        validationResult: validationResult,
      },
      chatHistory,
      modelDetails: {
        model: modelConfig.model,
        temperature: modelConfig.config.temperature,
        maxOutputTokens: modelConfig.config.maxOutputTokens,
        responseMimeType: modelConfig.config.responseMimeType,
        safetySettings: modelConfig.config.safetySettings,
      },
    }});
    
    // Send error before function terminates
    await Sentry.flush(1000);
    
    throw error;
  }
});