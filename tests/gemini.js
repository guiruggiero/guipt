import { GEMINI_API_KEY } from "../../secrets/guiruggiero.mjs";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from "fs";
import prompt from "prompt-sync";

// Initializations
const apiKey = GEMINI_API_KEY;
// console.log(apiKey);

const genAI = new GoogleGenerativeAI(apiKey);

const promptUser = new prompt();

// Model setup
// const modelChosen = "gemini-1.5-pro";
const modelChosen = "gemini-1.5-flash";
// const modelChosen = "gemini-1.0-pro";

let instructions = fs.readFileSync("../functions/prompt.txt", "utf8");
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
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const model = genAI.getGenerativeModel({
  model: modelChosen,
  systemInstruction: instructions,
  generationConfig,
  safetySettings,
});

// Simple text generation
// async function textInput() {
//   const result = await model.generateContent("What can you do?");
//   const response = result.response;
//   const text = response.text();
//   console.log(text);
// }

// textInput();

// Multi-turn chat
async function multiTurn() {
  const chat = model.startChat();

  console.log("Starting chat. Enter 'quit' to exit.\n");

  let input = promptUser("User: ");

  while (input != "quit") {
    const result = await chat.sendMessage(input);
    const response = result.response;
    const text = response.text();
    console.log("GuiPT: " + text);

    // console.log(response.promptFeedback);
    // console.log(response.promptFeedback.blockReason);
    // console.log(response.promptFeedback.safetyRatings);
    // console.log(response.safetyRatings);
    
    input = promptUser("User: ");
  }

  console.log("\nChat terminated.\n");

  // Check if context is preserved
  // let history = await chat.getHistory()
  // console.log(JSON.stringify(history, null, 2))
}

multiTurn();