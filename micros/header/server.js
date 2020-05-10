const express = require("express");
const bodyParser = require("body-parser");

const React = require("react");
const { renderToString } = require("react-dom/server");

const SSR = require("./static");

server(process.env.PORT || 3002);

function server(port) {
  const app = express();

  app.use(bodyParser.json());
  app.use(express.static("static"));

  app.get("/", (req, res) =>
    res.status(200).json({
      component: renderMarkup(renderToString(React.createElement(SSR))),
      files: [
        "global-entry.js",
        "node_modules_object-assign_index_js-node_modules_prop-types_checkPropTypes_js.js",
        "src_components_ssr_js.js",
        "vendors-node_modules_react_index_js.js",
        "vendors-node_modules_react-dom_index_js.js",
      ],
    })
  );

  app.post("/", (req, res) => {
    const { props } = req.body;
    return res.status(200).json({
      component: renderMarkup(renderToString(React.createElement(SSR, props))),
      // files,
      files: ["header-entry.js"],
    });
  });

  app.listen(port, () => console.log(`Up and listening on port ${port}`));
}

function renderMarkup(html) {
  return `<div data-component="Header" data-component-scope="header">${html}</div>`;
}
