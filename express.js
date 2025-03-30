import express from "express";
import {EXPRESS_PORT} from "../secrets/guipt.mjs";
import bodyParser from "body-parser";
import {callGuiPT} from "./guipt-wa.js";
import twilio from "twilio";
const {MessagingResponse} = twilio.twiml;

// Initialization
const app = express();
const port = EXPRESS_PORT;

// Middleware to parse incoming POST requests
app.use(bodyParser.urlencoded({extended: false}));

app.post("/webhook", async (request, response) => {
    try {
        // Get message and sender from request
        const message = request.body.Body;
        // const sender = request.body.WaId;

        // Call Gemini API
        const guiptResponse = await callGuiPT(null, message);

        // Create Twilio response object
        const twiml = new MessagingResponse();
        twiml.message(guiptResponse);

        // Send response back
        response.type("text/xml").send(twiml.toString());
    
    } catch (error) {
        console.error("Error processing message:", error);
        response.status(500).send("Error processing message");
    }
});

// Health check endpoint
app.get("/health", (request, response) => {
    response.status(200).send("Server is running");
});

// Start the server
app.listen(port, () => {
    console.log("Express server running on port", port);
});