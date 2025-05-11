import ScreenController from "./scripts/ScreenController";

import "./styles/general.css";
import "./styles/header.css"

const handler = ScreenController;
const cityForm = document.getElementById("city-form");

cityForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = document.getElementById("input-city").value;
  if (city == "") {
    return;
  }
  (await handler).updateData(city);
});
