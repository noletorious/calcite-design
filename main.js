const appDiv = document.getElementById("app");

const routes = {
  "/": {
    title: "Learner",
    load: async () => {
      const res = await fetch("./views/learner.html");
      return res.text();
    },
  },
  "/working": {
    title: "Working Canvas",
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

function updateActiveNav(hash) {
  const links = document.querySelectorAll(".nav-link[data-route]");
  links.forEach((link) => {
    const route = link.getAttribute("data-route");
    if (route === hash || (hash === "" && route === "/")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// innerHTML does not execute <script> tags, so re-create and append them
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

async function navigate() {
  let hash = window.location.hash.slice(1) || "/";

  // Redirect legacy /learner route to /
  if (hash === "/learner") {
    window.location.hash = "#/";
    return;
  }

  const route = routes[hash];

  if (!route) {
    appDiv.innerHTML = "<h2>404 - Page not found</h2>";
    return;
  }

  document.title = `${route.title} | Calcite Design System`;
  const content = await route.load();
  appDiv.innerHTML = extractBody(content);
  runScripts(appDiv);
  updateActiveNav(hash);
}

window.addEventListener("hashchange", navigate);
navigate();
