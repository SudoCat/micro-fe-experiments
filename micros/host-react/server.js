const express = require("express");
const bodyParser = require("body-parser");

server(process.env.PORT || 3004);

function server(port) {
  const app = express();

  app.use(bodyParser.json());
  app.use(express.static("static"));

  app.get("/", (req, res) =>
    res.status(200).json({
      files: ["index.js"],
    })
  );

  app.post("/", (req, res) =>
    res.status(200).json({
      files: ["react-entry.js"],
    })
  );

  app.listen(port, () => console.log(`Up and listening on port ${port}`));
}
