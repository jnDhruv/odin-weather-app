import ScreenController from "./scripts/ScreenController";

import "./styles/general.css";
import "./styles/header.css";
import "./styles/mediaQueries.css";

const handler = ScreenController;
const cityForm = document.getElementById("city-form");

cityForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = document.getElementById("input-city").value;
  if (city == "") {
    return;
  }
  (await handler).updateData(titleize(city));
});

async function init() {
  (await handler).render();
}

function titleize(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

init();
