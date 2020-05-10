const hosts = [
  {
    scope: "hostReact",
    module: "host-react",
  },
];

if (
  document.readyState === "complete" ||
  document.readyState === "loaded" ||
  document.readyState === "interactive"
) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
}

function init() {
  Promise.all(hosts.map(loadComponent));
}

function loadComponent({ scope, module }) {
  return window[scope]
    .get(module)
    .then((factory) => Promise.resolve(factory().default));
}
