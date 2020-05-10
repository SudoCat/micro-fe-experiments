const express = require("express");

function server(port) {
  const app = express();
  app.use(express.static("static"));
  app.listen(port, () => console.log(`Up and listening on port ${port}`));
}

server(process.env.PORT || 8000);
