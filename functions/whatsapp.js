const {onRequest} = require("firebase-functions/v2/https");
// const guipt = require("./guipt");
const { MessagingResponse } = require("twilio").twiml;

exports.twilio = onRequest(async (request, response) => {
    // console.log("Twilio request.body:", request.body);
    
    const message = request.body.Body;
    const from = request.body.WaId;
    console.log(from, "said:", message);

    const twiml = new MessagingResponse();
    twiml.message("The Robots are coming! Head for the hills!");
    // console.log("twiml.toString():", twiml.toString());

    response.type("text/xml").send(twiml.toString());
    console.log("Response sent");

    // guiptResponse = async guipt.guipt(message);
});
