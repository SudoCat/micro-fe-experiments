const React = require("react");
const ReactDOM = require("react-dom");

if (
  document.readyState === "complete" ||
  document.readyState === "loaded" ||
  document.readyState === "interactive"
) {
  rehydrate();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    rehydrate();
  });
}

function rehydrate() {
  const targets = document.querySelectorAll("[data-component]");
  targets.forEach((target) => {
    const scope = target.dataset.componentScope;
    const module = target.dataset.component;
    // setTimeout(function () {
    loadComponent(scope, module).then((Component) => {
      ReactDOM.hydrate(
        React.createElement(Component, JSON.parse(target.dataset.props)),
        target
      );
      delete target.dataset.props;
    });
    // }, Math.random() * 5000);
  });
}

function loadComponent(scope, module) {
  return window[scope]
    .get(module)
    .then((factory) => Promise.resolve(factory().default));
}
