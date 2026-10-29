const appDiv = document.getElementById("app");

const routes = {
  "/": {
    title: "Home",
    load: () => `
      <h2>Welcome</h2>
      <p>
        Calcite Design System is a set of web components for building
        consistent ArcGIS applications.
      </p>
      <p>
        Start with the <a href="#/learner">Learner</a> to explore
        components and copy examples.
      </p>
      <calcite-button>Click me</calcite-button>
    `,
  },
  "/learner": {
    title: "Learner",
    load: async () => {
      const res = await fetch("./learner.html");
      return res.text();
    },
  },
  "/working": {
    title: "Working",
    load: async () => {
      const res = await fetch("./views/working.html");
      return res.text();
    },
  },
};

function extractBody(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.innerHTML;
}

async function navigate() {
  const hash = window.location.hash.slice(1) || "/";
  const route = routes[hash];

  if (!route) {
    appDiv.innerHTML = "<h2>404 - Page not found</h2>";
    return;
  }

  document.title = `${route.title} | Calcite Design System`;
  const content = await route.load();
  appDiv.innerHTML = extractBody(content);
  runScripts(appDiv);
}

// innerHTML does not execute <script> tags, so re-create them
function runScripts(root) {
  root.querySelectorAll("script").forEach((oldScript) => {
    const script = document.createElement("script");
    for (const attr of oldScript.attributes) {
      script.setAttribute(attr.name, attr.value);
    }
    script.textContent = oldScript.textContent;
    oldScript.replaceWith(script);
  });
}

window.addEventListener("hashchange", navigate);
navigate();
