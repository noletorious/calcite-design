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
  "/sign-in-flow-example": {
    title: "Sign-In Flow Example",
    load: async () => {
      const res = await fetch("./views/sign-in-flow-example.html");
      return res.text();
    },
  },
  "/sign-in-flow": {
    title: "Sign-In Flow Example",
    redirect: "#/sign-in-flow-example",
  },
  "/ui-flow": {
    title: "Sign-In Flow Example",
    redirect: "#/sign-in-flow-example",
  },
  "/ui-flow-example": {
    title: "Sign-In Flow Example",
    redirect: "#/sign-in-flow-example",
  },
};

// Extracts styles, scripts, and body from raw ArcGIS copy-paste examples
function extractView(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Collect head styles and stylesheets that would otherwise be discarded
  const headStyles = [];
  doc.querySelectorAll("head style, head link[rel='stylesheet']").forEach((el) => {
    headStyles.push(el.outerHTML);
  });

  // Collect any scripts declared in <head>
  const headScripts = [];
  doc.querySelectorAll("head script").forEach((el) => {
    headScripts.push(el.outerHTML);
  });

  // Extract body content or fallback to full html
  const bodyContent = doc.body ? doc.body.innerHTML : html;

  return `${headStyles.join("\n")}\n${bodyContent}\n${headScripts.join("\n")}`;
}

function updateActiveNav(hash) {
  const links = document.querySelectorAll(".nav-link[data-route], .dropdown-item[data-route]");
  links.forEach((link) => {
    const route = link.getAttribute("data-route");
    if (route === hash || (hash === "" && route === "/")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Highlight parent dropdown if child item is active
  const dropdownToggle = document.getElementById("examplesDropdownToggle");
  if (dropdownToggle) {
    const isExampleActive = hash === "/sign-in-flow-example" || hash.includes("flow");
    dropdownToggle.classList.toggle("active", isExampleActive);
  }
}

function setupDropdowns() {
  const dropdownToggle = document.getElementById("examplesDropdownToggle");
  const dropdownContainer = dropdownToggle?.closest(".nav-item-dropdown");

  if (dropdownToggle && dropdownContainer) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdownContainer.classList.toggle("open");
      dropdownToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      if (!dropdownContainer.contains(e.target)) {
        dropdownContainer.classList.remove("open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });

    dropdownContainer.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        dropdownContainer.classList.remove("open");
        dropdownToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
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

  if (route.redirect) {
    window.location.hash = route.redirect;
    return;
  }

  document.title = `${route.title} | Calcite Design System`;
  const content = await route.load();
  appDiv.innerHTML = extractView(content);
  runScripts(appDiv);
  updateActiveNav(hash);
}

setupDropdowns();
window.addEventListener("hashchange", navigate);
navigate();
