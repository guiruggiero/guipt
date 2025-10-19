// Imports
const Sentry = require("@sentry/node");
const {GoogleGenAI} = require("@google/genai");
const fs = require("node:fs");
const sanitizeHtml = require("sanitize-html");
const {onRequest} = require("firebase-functions/v2/https");

// Initializations
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  enableLogs: true,
});
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: apiKey});

// Get system instructions from file
const instructions = fs.readFileSync("prompt.txt", "utf8");

// Model safety settings
const safetySettings = [
  {category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_LOW_AND_ABOVE"},
  {category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_LOW_AND_ABOVE"},
  {category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_LOW_AND_ABOVE"},
  {category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"},
];

// Model configuration
const modelConfig = {
  model: "gemini-flash-lite-latest",
  config: {
    systemInstruction: instructions,
    temperature: 0.4,
    maxOutputTokens: 400,
    responseMimeType: "text/plain",
    safetySettings: safetySettings,
    thinkingconfig: {
      thinkingbudget: 0,
    },
  },
};

// Sanitize potentially harmful characters
function sanitizeInput(input) {
  let sanitizedInput = input.replace(/\s+/g, " "); // Normalize whitespace
  sanitizedInput = sanitizedInput.trim(); // Remove whitespace from both ends
  sanitizedInput = sanitizeHtml(sanitizedInput, { // Remove HTML tags/attributes
    allowedTags: [],
    allowedAttributes: {},
  });
  return sanitizedInput;
};

// Assess guardrails
function validateInput(input) {
  // Length limit
  if (input.length > 200) {
    return "⚠️ Would you mind shortening your message a bit, please?";
  }

  // Character set - excludes @$%&/+
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,!?;:'’"()-]+$/.test(input)) {
    return "⚠️ Please use only letters, numbers, and common punctuation.";
  }

  return "OK";
};

// Function configuration
const functionConfig = {
  cors: true,
  maxInstances: 5,
  timeoutSeconds: 4,
};

exports.guipt = onRequest(functionConfig, async (request, response) => {
  Sentry.logger.info("GuiPT started");

  // Get user prompt from request
  let userInput = request.query.prompt;
  if (!userInput || userInput == " ") {
    userInput = "Hi! Briefly, who are you and what can you do?";
  }

  // Sanitize and validate input
  const sanitizedInput = sanitizeInput(userInput);
  const validationResult = validateInput(sanitizedInput);

  // Return error message if input doesn't pass validation
  if (validationResult !== "OK") {
    Sentry.logger.warn("Validation failed", {validationResult});
    await Sentry.flush(2000);

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

  Sentry.logger.info("Ready for Gemini call", {sanitizedInput});

  try {
    // Call Gemini API and send response back
    const result = await chat.sendMessage({message: sanitizedInput});
    const guiptResponse = result.text;
    Sentry.logger.info("GuiPT done", {guiptResponse});
    response.status(200).send(guiptResponse);
    return;
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
    await Sentry.flush(2000);

    throw error;
  }
});
