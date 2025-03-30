import axios from "axios";
import {cloudFunctionURL} from "../secrets/guipt.mjs";

const chatHistory = [];
// const input = "What is Gui's email?";
// const input = "What is Gui's full name?";
const input = "How old is he?";

axios
    .post(cloudFunctionURL, null, { params: {
        history: chatHistory,
        prompt: input,
    }})
    .then((response) => {
        // console.log(response)
        const guiptResponse = response.data;
        console.log("GuiPT: " + guiptResponse);
    })
    .catch((error) => {
        console.log("Error: ", error);
    });