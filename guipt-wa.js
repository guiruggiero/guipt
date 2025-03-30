import {GEMINI_API_KEY} from "../secrets/guipt.mjs"; // For tests/express.js
import fs from "fs";
import {HarmCategory, HarmBlockThreshold, GoogleGenerativeAI} from "@google/generative-ai";
import sanitizeHtml from "sanitize-html";

// Initializations
// const apiKey = process.env.GEMINI_API_KEY;
const apiKey = GEMINI_API_KEY; // For tests/express.js
const genAI = new GoogleGenerativeAI(apiKey);

// Get system instructions from file
// const instructions = fs.readFileSync("prompt.txt", "utf8");
const instructions = fs.readFileSync("/home/ubuntu/guipt/prompt.txt", "utf8"); // For tests/express.js

// Gemini variation - https://ai.google.dev/gemini-api/docs/models/gemini
const chosenModel = "gemini-2.0-flash-lite-preview-02-05"; // gemini-1.5-flash-latest

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

export async function callGuiPT(context, input) {
  // Get user prompt from request
  let userInput = input;
  if (!userInput || userInput == " ") userInput = "Hi! Briefly, who are you and what can you do?";

  // Sanitize and validate input
  const sanitizedInput = sanitizeInput(userInput);
  const validationResult = validateInput(sanitizedInput);

  // Return error message if input doesn't pass validation
  if (validationResult !== "OK") {
    return validationResult;
  }

  // Get chat history and initialize chat
  let chatHistory = context;
  if (!chatHistory) chatHistory = [];
  const chat = model.startChat({history: chatHistory});

  try{
    // Call Gemini API and send response back
    const result = await chat.sendMessage(sanitizedInput);
    const guiptResponse = result.response.text();
    return guiptResponse;
  
  } catch (error) {
    if (error.name == "GoogleGenerativeAIError") console.error(`Gemini API - ${error.message}:`, error);
    else console.error(error);
    throw error;
  }
};