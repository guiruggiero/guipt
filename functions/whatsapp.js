const {onRequest} = require("firebase-functions/v2/https");
const {callGuiPT} = require("./guipt-wa.js");
const {MessagingResponse} = require("twilio").twiml;

exports.twilio = onRequest(async (request, response) => {
    // Get user message from request
    const message = request.body.Body;
    
    // Call Gemini API
    const guiptResponse = await callGuiPT(null, message);

    // Create Twilio response object
    const twiml = new MessagingResponse();
    twiml.message(guiptResponse);

    // Send response back
    response.type("text/xml").send(twiml.toString());
});