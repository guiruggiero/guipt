import {GEMINI_API_KEY} from "../../secrets/guipt.mjs";
import {GoogleGenAI} from "@google/genai";
import fs from "fs";
import prompt from "prompt-sync";

// Initializations
const apiKey = GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: apiKey});
const promptUser = new prompt();

// Model setup
const modelChosen = "gemini-2.0-flash-lite";

let instructions = fs.readFileSync("prompt.txt", "utf8");

const safetySettings = [
  {category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE"},
  {category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE"},
  {category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE"},
  {category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE"},
];

const modelConfig = {
  model: modelChosen,
  config: {
    systemInstruction: instructions,
    temperature: 0.4,
    maxOutputTokens: 400,
    responseMimeType: "text/plain",
    safetySettings: safetySettings,
  },
};

// Multi-turn chat
async function multiTurn() {
  const chat = ai.chats.create(modelConfig);

  console.log("Starting chat. Enter 'quit' to exit.\n");

  let input = promptUser("User: ");

  while (input != "quit") {
    const result = await chat.sendMessage({message: input});
    const response = result.text;

    console.log("GuiPT: " + response);
  
    input = promptUser("User: ");
  }

  console.log("\nChat terminated.\n");

}

multiTurn();