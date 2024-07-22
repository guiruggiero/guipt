import {PROMPT_URL} from "../secrets/guiruggiero.mjs";
import jsdom from "jsdom";
import {htmlToText} from "html-to-text";
import fs from "fs";

const url = PROMPT_URL;

// Gets source form page
const response = await fetch(url);
const document = await response.text();

// Parses HTML to get only prompt content
const dom = new jsdom.JSDOM(document);
const contentHTML = dom.window.document.querySelectorAll("div.doc-content")[0].innerHTML;

// Turns HTML into plain text
const contentText = htmlToText(contentHTML, {
    wordwrap: null,
});
const newPrompt = contentText.replace(/\n{2,}/g, '\n');

const oldPrompt = fs.readFileSync("functions/prompt.txt", "utf8");
// console.log(oldPrompt.length);
// console.log(newPrompt.length);

// If new version is bigger (proxy for updated), save to file
if (newPrompt.length > oldPrompt.length) {
    fs.writeFileSync("functions/prompt.txt", newPrompt, 'utf-8', (error) => {
        if (error) {
            console.log(error);
            return;
        }
    });

    console.log("Prompt updated: " + (newPrompt.length - oldPrompt.length) + " characters bigger.");
}
else {
    console.log("Prompt doesn't need an update.");
}