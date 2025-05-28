import ScreenController from "./scripts/ScreenController";

import "./styles/general.css";
import "./styles/header.css";
import "./styles/mediaQueries.css";
import "./styles/dialogs.css";

const handler = ScreenController;
const cityForm = document.getElementById("city-form");

cityForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = titleize(document.getElementById("input-city").value);
  document.getElementById("input-city").value = city;
  if (city == "") {
    return;
  }
  (await handler).updateData(titleize(city));
});

const settings = document.querySelector(".settings button");
settings.addEventListener("click", () => {
  const settingsDiag = document.querySelector(".settings-diag");
  settingsDiag.showModal();

  const settingsForm = document.querySelector(".settings-diag form");
  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const unitVal = document.getElementById("unitGroup").value;
    (await handler).updateUnit(unitVal);
    settingsDiag.close();
  });
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
