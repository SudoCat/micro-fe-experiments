const React = require("react");
const ReactDOM = require("react-dom");
const Header = require("./components/Footer.jsx");

const SSR = Header.default;

// Render only in the browser, export otherwise
if (typeof document === "undefined") {
  module.exports = SSR;
} else {
  const targets = document.querySelectorAll('[data-component="header"]');
  targets.forEach((target) => {
    ReactDOM.hydrate(
      React.createElement(SSR, JSON.parse(target.dataset.props)),
      target
    );
    delete target.dataset.props;
  });
}
