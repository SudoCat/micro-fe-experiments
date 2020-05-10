const hosts = [
  {
    scope: "hostReact",
    component: "host-react",
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
  hosts.forEach(loadComponent);
}

function loadComponent({ scope, module }) {
  return window[scope]
    .get(module)
    .then((factory) => Promise.resolve(factory().default));
}
