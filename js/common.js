const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const currentPage = urlParams.get("q");

// Template for JSON fetched data with record count
function jsonTemplate(index, data) {
  return `
            <div class='dash-box'>${index >= 0 ? index + 1 + "." : ""}
                <div class='title'>${data.title}</div>
                    <div class='content'>
                        ${data.creator ? `<p>> ${data.creator}</p>` : ""}
                    <p>${data.description}</p></div>
                        ${data.links ? linkData(data.links) : ""}
                    </div>
            `;
}

// Template for IP address info data.
function ipinfoTemplate(data) {
  if (data.Answer) {
    var ddg = data.Answer.replace(/<a\b[^>]*>/i, "");
  }
  return `
            <div class='dash-box'>
                <div class='title'>Detected IP Address</div>
                    <div class='content'>
                        <ul>
                        ${ddg ? `<li>${ddg}</li>` : ""}
                        </ul>
                        </div></div>
            `;
}

function browserTemplate(data) {
  return `
            <div class='dash-box'>
                <div class='title'>Detected Browser Agent</div>
                    <div class='content'>
                        <p>${data}</p>
                        </div></div>
            `;
}

function disclaimerTemplate(data) {
  return `
            <div class='dash-box'>
                <div class='title'>Disclaimer & Privacy</div>
                    <div class='content'>
                        ${data}
                        </div></div>
            `;
}

function linkData(links) {
  return `
    <ul class='link-box'>
    ${links
      .map(
        (link) =>
          `<li class='link-button'><a href='${link.url}' target='_blank'>${link.id}</a></li>`
      )
      .join("")}
    </ul></div>
    `;
}

const fetchStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};

const fetchJson = (response) => response.json();

switch (currentPage) {
  default:
    var navName = null;
    var jsonFilename = null;
    break;
  case "disclaimer":
    var jsonFilename = "json/disclaimer.json";
    var navName = "disclaimer";
    var showCount = false;
    break;
  case "ipinfo":
    var jsonFilename = null;
    var navName = "ipinfo";
    break;
  case "browser":
    var jsonFilename = null;
    var navName = "browser";
    break;
}

if (navName) {
  document.getElementById("pageId").innerHTML = `WOCSEC~$ show ${navName}`;
  let navItem = document.getElementsByName(navName);
  navItem[0].classList.add("is-current");
}

if (jsonFilename) {
  fetch(jsonFilename)
    .then(fetchStatus)
    .then(fetchJson)
    .then((data) => {
      if (!data.length) {
        document.getElementById("resultCount").innerHTML = `No results found.`;
      }
      if (data.length > 1) {
        var resultWord = "results";
      } else if (data.length === 1) {
        var resultWord = "result";
      }
      if (showCount && data.length > 0) {
        document.getElementById("contentOutput").innerHTML = `
                ${data
                  .map((jsonData, index) => jsonTemplate(index, jsonData))
                  .join("")}`;
        document.getElementById(
          "resultCount"
        ).innerHTML = `Displaying ${data.length} ${resultWord}.`;
      } else {
        document.getElementById("contentOutput").innerHTML = `
                ${data
                  .map((jsonData, index) =>
                    jsonTemplate((index = undefined), jsonData)
                  )
                  .join("")}`;
      }
    })
    .catch((error) => {
      console.log("Request failed", error);
      document.getElementById("resultCount").innerHTML = `No results found.`;
    });
}

if (currentPage === "ipinfo") {
  fetch("https://api.duckduckgo.com/?q=ip+address&format=json")
    .then(fetchStatus)
    .then(fetchJson)
    .then((data) => {
      document.getElementById("contentOutput").innerHTML = `
                    ${ipinfoTemplate(data)}
        `;
    })
    .catch((error) => {
      console.log("Request failed", error);
    });
}

if (currentPage === "browser") {
  let data = navigator.userAgent;
  document.getElementById("contentOutput").innerHTML = `
                    ${browserTemplate(data)}
        `;
}

// Functions for controlling CSS theme dark or light
// Set a given theme/color-scheme
function setTheme(themeName) {
  localStorage.setItem("theme", themeName);
  document.documentElement.className = themeName;
}
// Toggle between light and dark theme
function toggleTheme() {
  var linkText = document.getElementById("theme-toggle");
  if (localStorage.getItem("theme") === "theme-dark") {
    setTheme("theme-light");
    linkText.innerHTML = "Dark";
  } else {
    setTheme("theme-dark");
    linkText.innerHTML = "Light";
  }
}
// Set theme on initial load
(function () {
  var linkText = document.getElementById("theme-toggle");
  if (localStorage.getItem("theme") === "theme-light") {
    setTheme("theme-light");
    linkText.innerHTML = "Dark";
  } else {
    setTheme("theme-dark");
    linkText.innerHTML = "Light";
  }
})();
