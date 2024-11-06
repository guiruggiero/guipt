import { firebaseConfig } from "../../secrets/guiruggiero.mjs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, doc, setDoc, Timestamp } from "firebase/firestore/lite";
import prompt from "prompt-sync";

// Initializations
// console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const promptUser = new prompt();

const mode = "dev";
// const mode = "mvp";
// const mode = "v1";
// console.log("Mode: ", mode);

async function test() {
    console.log("Starting fake chat ('quit' to exit)");

    // Initializations
    let turnCount = 1;
    let user = promptUser("User-" + turnCount + ": ");
    // console.log(user);

    const start = Timestamp.now();
    // console.log(start);
    // console.log(start.seconds);
    // console.log(start.toDate())

    let model = "";
    let end = Timestamp.now();

    let chatData = {
        start: start.toDate(),
        // startTimestamp: start.seconds,
    };
    let turnData = {};

    // Creates the chat document on Firestore
    const chatRef = await addDoc(collection(db, mode), chatData);
    // console.log("Document created with ID: ", chatRef.id);

    while (user != "quit") {
        model = promptUser("GuiPT-" + turnCount + ": ");
        // console.log(model);

        turnData = {
            turn: turnCount,
            user: user,
            model: model,
        };
        // console.log(turnData);

        // Creates the turn document on Firestore with a specific ID
        const turnRef = doc(collection(db, mode, chatRef.id, "turns"), `turn_${turnCount}`);
        await setDoc(turnRef, turnData); 

        turnCount++;

        user = promptUser("User-" + turnCount + ": ");
        // console.log(user);
        end = Timestamp.now(); // Here, the only way of exiting is quitting
    }

    chatData = {
        end: end.toDate(),
        // endTimestamp: end.seconds,
        turnCount: turnCount - 1,
    };
    // console.log(chatData);

    // Updates the chat document on Firestore
    await updateDoc(chatRef, chatData);

    console.log("Fake chat terminated");

}

test();