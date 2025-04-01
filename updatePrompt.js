import {PROMPT_URL} from "../secrets/guipt.mjs";
import jsdom from "jsdom";
import {htmlToText} from "html-to-text";
import fs from "fs";

const url = PROMPT_URL;

// Gets source from page
const response = await fetch(url);
const document = await response.text();

// Parses HTML to get only prompt content
const dom = new jsdom.JSDOM(document);
const contentHTML = dom.window.document.querySelectorAll("div.doc-content")[0].innerHTML;

// Turns HTML into plain text
const contentText = htmlToText(contentHTML, {wordwrap: null});
const newPrompt = contentText.replace(/\n{2,}/g, "\n");

const oldPrompt = fs.readFileSync("functions/prompt.txt", "utf8");
// console.log(oldPrompt.length);
// console.log(newPrompt.length);

fs.writeFileSync("functions/prompt.txt", newPrompt, "utf-8", (error) => {
  if (error) {
    console.error(error);
    return;
  }
});

console.log("Prompt updated! Character diff: " + (newPrompt.length - oldPrompt.length));