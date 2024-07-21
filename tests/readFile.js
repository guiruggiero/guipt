// const fs = require("node:fs");

import fs from "fs";

fs.readFile("../functions/prompt.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  
  console.log(data);
});