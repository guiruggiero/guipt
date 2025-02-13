const {onRequest} = require("firebase-functions/v2/https");
const {callGuiPT} = require("./guipt-wa.js");
const {MessagingResponse} = require("twilio").twiml;

exports.twilio = onRequest(async (request, response) => {
    const message = request.body.Body;

    const guiptResponse = await callGuiPT(null, message);

    const twiml = new MessagingResponse();
    twiml.message(guiptResponse);

    response.type("text/xml").send(twiml.toString());
});