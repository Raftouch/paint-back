const express = require("express");
const app = express();
const WSServer = require("express-ws")(app);

require("dotenv").config();
const port = process.env.PORT;

app.ws("/", (ws, req) => {
  console.log("All works");
  ws.on("message", (msg) => {
    console.log(msg);
  });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
