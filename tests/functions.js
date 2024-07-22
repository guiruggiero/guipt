// import * as functions from "firebase-functions";
const {onRequest} = require("firebase-functions/v2/https");
const fs = require("fs");

exports.helloWorld = onRequest({cors: true}, (request, response) => {
  let name = request.query.name;
  if (!name) {
    name = "undefined";
  }

  console.log("Name passed is " + name);
  response.send("Hello from GuiPT, " + name + "!");
});

exports.readFile = onRequest({cors: true}, (request, response) => {
  // response.send("Data: " + promptRead);

  const instructions = fs.readFileSync("prompt.txt", "utf8");
  response.send(instructions);
});

exports.secret = onRequest({cors: true}, (request, response) => {
  const key = process.env.TEST_KEY;

  response.send("Secret: " + key);
});

// exports.firestore = onRequest({cors: true}, (request, response) => {
//   const initializeApp = require("firebase/app");
//   const {getFirestore, collection, addDoc} =
//     require("firebase/firestore/lite");

//   const firebaseConfig = {
//     apiKey: process.env.FB_API_KEY,
//     authDomain: process.env.FB_AUTH_DOMAIN,
//     projectId: process.env.FB_PROJECT_ID,
//     storageBucket: process.env.FB_STORAGE_BUCKET,
//     messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
//     appId: process.env.FB_APP_ID,
//   };
//   const app = initializeApp(firebaseConfig);
//   const db = getFirestore(app);

//   const mode = "dev";

//   addDoc(collection(db, mode), "test"); // await?

//   response.send("Logged!");
// });

// --

const {onSchedule} = require("firebase-functions/v2/scheduler");
const jsdom = require("jsdom");
const {htmlToText} = require("html-to-text");

const url = process.env.PROMPT_URL;

// Run once a day at midnight (manual run here https://console.cloud.google.com/cloudscheduler)
exports.updatePrompt = onSchedule("every day 00:00", async () => { // event as argument?
  const response = await fetch(url);
  const document = await response.text();

  const dom = new jsdom.JSDOM(document);
  const contentHTML = dom.window.document.
      querySelectorAll("div.doc-content")[0].innerHTML;

  const contentText = htmlToText(contentHTML, {wordwrap: null});
  const contentTextClean = contentText.replace(/\n{2,}/g, "\n");

  fs.writeFileSync("prompt.txt", contentTextClean, "utf-8", (error) => {
    if (error) {
      console.error(error);
    }
  });
});
