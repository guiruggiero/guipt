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
  fs.readFile("prompt.txt", "utf8", (err, data) => {
    if (err) {
      response.send("Error: " + err);
    }

    response.send("Data: " + data);
  });
});

exports.secret = onRequest({cors: true}, (request, response) => {
  const key = process.env.TEST_KEY;

  response.send("Secret: " + key);
});

// exports.firestore = onRequest({cors: true}, (request, response) => {

// });

// exports.gemini = onRequest({cors: true}, (request, response) => {

// });
