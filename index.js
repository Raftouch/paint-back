const express = require("express");
const app = express();
const WSServer = require("express-ws")(app);
const aWss = WSServer.getWss();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

app.use(cors());
app.use(express.json());

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

app.post("/image", (req, res) => {
  try {
    const data = req.body.img.replace("data:image/png;base64,", "");

    fs.writeFileSync(
      path.resolve(__dirname, "files", `${req.query.id}.png`),
      data,
      "base64",
    );

    return res.status(200).json({ message: "Downloaded" });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Something went wrong");
  }
});

app.listen(port, () => console.log(`App listening on port ${port}`));
