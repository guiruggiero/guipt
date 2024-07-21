// const prompt = require("prompt-sync")({ sigint: true });

import prompt from "prompt-sync";
const promptUser = new prompt();

let input = "";

while (input != "quit") {
    input = promptUser("Enter a command ('quit' to exit): ");
    console.log("You wrote: " + input + "\n");
}