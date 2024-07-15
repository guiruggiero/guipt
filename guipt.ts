// TODO: build and pass history

import prompt from "prompt-sync";
import {cloudFunctionURL} from "../secrets/guiruggiero.mjs";
import axios from "axios";

const prompt_user = new prompt();

// Multi-turn chat
async function multi_turn() {
  console.log("Starting chat. Enter 'quit' to exit.\n");

  let input = prompt_user("User: ");

  while (input != "quit") {
    axios
      // .post(cloudFunctionURL, { conversation })
      .post(cloudFunctionURL) // TODO: pass prompt
      .then((response) => {
        const guiptResponse = response.data.response;
        console.log("GuiPT: " + guiptResponse);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    
    input = prompt_user("User: ");
  }

  console.log("\nChat terminated.\n");
}

multi_turn();
