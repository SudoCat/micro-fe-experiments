const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fetch = require("node-fetch");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();

app.use(
  "/",
  createProxyMiddleware({
    target: "http://localhost:8000",
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: modifyResponse,
  })
);

app.listen(8080);

function modifyResponse(proxyRes, req, res) {
  if (!proxyRes.headers["content-type"].startsWith("text/html")) return;

  if (proxyRes.statusCode != 200) return;

  var body = [];

  proxyRes.on("data", function (chunk) {
    body.push(chunk);
  });

  proxyRes.on("end", function () {
    body = Buffer.concat(body).toString();
    const dom = new JSDOM(body);
    const { document } = dom.window;
    applyStitching(document)
      .then(() => {
        res.end(dom.serialize());
      })
      .catch((e) => {
        res.end(e.message);
      });
  });
}

const hosts = [
  {
    url: "http://localhost:3001",
    components: ["host"],
  },
  {
    url: "http://localhost:3004",
    components: ["host-react"],
  },
  {
    url: "http://localhost:3002",
    components: ["header"],
  },
  {
    url: "http://localhost:3003",
    components: ["footer"],
  },
];

async function applyStitching(document) {
  const placeholders = [...document.querySelectorAll("script[data-component]")];
  return await Promise.all(
    placeholders.map((placeholder) =>
      stitchComponent(document, placeholder, {
        name: placeholder.dataset.component,
        props: placeholder.textContent
          ? JSON.parse(placeholder.textContent)
          : null,
      })
    )
  );
}

async function stitchComponent(document, placeholder, data) {
  var host = findHost(data.name);
  if (!host) {
    console.error("Host not found");
    return false;
  }

  var json = await getComponent(host.url, data);
  if (!json) {
    console.error("Component not found");
    return false;
  }

  if (json.component) {
    replacePlaceholder(document, placeholder, json.component);
  } else {
    placeholder.remove();
  }

  if (json.files && json.files.length) {
    json.files.forEach((file) => injectScript(document, `${host.url}/${file}`));
  }

  return true;
}

function findHost(name) {
  return hosts.find((host) => host.components.includes(name));
}

async function getComponent(url, data) {
  const options = {
    headers: { "Content-Type": "application/json" },
  };
  if (data) {
    options.method = "POST";
    options.body = JSON.stringify(data);
  }
  const res = await fetch(url, options);
  const json = await res.json();
  return json;
}

function replacePlaceholder(document, placeholder, html) {
  var container = document.createElement("div");
  container.innerHTML = html;
  container.firstChild.dataset.props = placeholder.textContent;
  placeholder.replaceWith(container.firstChild);
}

function injectScript(document, src) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = src;
  document.head.appendChild(script);
}
