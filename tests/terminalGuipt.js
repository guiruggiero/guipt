import prompt from "prompt-sync";
import axios from "axios";
import {cloudFunctionURL} from "../../secrets/guipt.mjs";
// console.log(cloudFunctionURL);

// Initializations
const promptUser = new prompt();
let guiptResponse = "";
let chatHistory = [];

console.log("Starting chat. Enter 'quit' to exit.\n");

let input = promptUser("User: ");

while (input != "quit") {
  // Calling Gemini API via Firebase Cloud Function
  await axios
    .post(cloudFunctionURL, null, { params: {
      history: chatHistory,
      prompt: input,
    }})
    .then((response) => {
      guiptResponse = response.data;
      console.log("GuiPT: " + guiptResponse);
    })
    .catch((error) => {
      console.log("Error: ", error);
    });

    // Updating chat history
    chatHistory.push({role: "user", parts: [{text: input}]});
    chatHistory.push({role: "model", parts: [{text: guiptResponse}]});
    // console.log(chatHistory);
    // console.log("\n");

    input = promptUser("User: ");
}

console.log("\nChat terminated.\n");