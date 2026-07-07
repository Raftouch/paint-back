const express = require("express");
const app = express();
const WSServer = require("express-ws")(app);
const aWss = WSServer.getWss();

require("dotenv").config();
const port = process.env.PORT;

app.ws("/", (ws, req) => {
  console.log("All works");

  ws.send(
    JSON.stringify({
      method: "connection",
      message: "Connection successful",
    }),
  );

  ws.on("message", (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case "connection":
        connectionHandler(ws, msg);
        break;
      case "draw":
        broadcastConnection(ws, msg);
    }
    console.log(msg);
  });
});

const connectionHandler = (ws, msg) => {
  ws.id = msg.id;

  broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach((client) => {
    if (client.id === ws.id && client !== ws) {
      client.send(JSON.stringify(msg));
    }
  });
};

app.listen(port, () => console.log(`App listening on port ${port}`));
