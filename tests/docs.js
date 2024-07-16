import {PROMPT_URL} from "../../secrets/guiruggiero.mjs";
import jsdom from "jsdom";
import {htmlToText} from "html-to-text";
import fs from "fs";

const url = PROMPT_URL;

const response = await fetch(url);
// console.log(response);
// console.log(await response.text());
const document = await response.text();
// console.log(document);

const dom = new jsdom.JSDOM(document);
// console.log(dom);
// console.log(dom.window);
// console.log(dom.window.document);

// contentHTML = dom.window.document.querySelectorAll("div")[0].innerHTML;
// contentHTML = dom.window.document.querySelectorAll("#contents")[0].innerHTML;
const contentHTML = dom.window.document.querySelectorAll("div.doc-content")[0].innerHTML;
// console.log(contentHTML);

const contentText = htmlToText(contentHTML, {
    wordwrap: null,
});
// console.log(contentText);

const contentTextClean = contentText.replace(/\n{2,}/g, '\n');

// TODO: if size =< prompt-backup.txt, or certain works don't exist, skip
fs.writeFileSync("prompt.txt", contentTextClean, 'utf-8', error => {
    if (error) {
        console.error(error);
        // TODO: copy from prompt-backup.txt
    }
});