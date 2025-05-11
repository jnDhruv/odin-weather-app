// Modules
import WeatherAPI from "./WeatherAPI.js";
import ThemeHandler from "./Theme.js";

// CSS
import "../styles/currWeather.css";

// Images
import mapIcon from "../images/icons/mapmarker.svg";
import precipIcon from "../images/icons/umbrella.svg";
import uvIcon from "../images/icons/uv-index.svg";
import windIcon from "../images/icons/wind.svg";
import humidIcon from "../images/icons/humidity.svg";

const ScreenController = async function () {
  const APIHandler = WeatherAPI;
  const themeHandler = ThemeHandler;

  let data = await APIHandler.getData("vadodara");

  const render = async () => {
    if (!data) {
      return;
    }
    // Updating theme & icon
    themeHandler.setTheme(data.currentConditions.icon);
    const imgObj = (await themeHandler.getIcon(data.currentConditions.icon)).default;
    const currDataIcon = document.querySelector(".current-weather .right");
    currDataIcon.innerHTML = "";
    currDataIcon.appendChild(createImg(imgObj));

    // Writing Current Data
    const currData = document.querySelector(".current-weather .left");
    currData.innerHTML = "";

    const locH3 = createHeading("h3", data.address);
    const mapImg = createImg(mapIcon, 20);
    locH3.prepend(mapImg);

    currData.append(
      locH3,
      createHeading(
        "h1",
        `${Math.floor(data.currentConditions.temp)}&deg;${APIHandler.getTempUnit()}`,
        "temp",
      ),
      createHeading("h2", data.currentConditions.conditions),
      createHeading(
        "h3",
        `Feels like: ${Math.floor(data.currentConditions.feelslike)}&deg;${APIHandler.getTempUnit()}`,
      ),
      createHeading("h3", data.resolvedAddress),
    );

    // Writing Stats data
    const statsData = document.querySelector(".stats");
    statsData.innerHTML = "";

    const descP = createP(data.description, "description");
    const precipDiv = createDiv(
      createImg(precipIcon, 30),
      createP("Precipitation %"),
      createP(data.currentConditions.precipprob),
    );
    const uvDiv = createDiv(
      createImg(uvIcon, 30),
      createP("UV Index"),
      createP(data.currentConditions.uvindex),
    );
    const windDiv = createDiv(
      createImg(windIcon, 30),
      createP("Wind Speed"),
      createP(data.currentConditions.windspeed),
    );
    const humidDiv = createDiv(
      createImg(humidIcon, 30),
      createP("Humidity %"),
      createP(data.currentConditions.humidity),
    );

    statsData.append(
      createDiv(descP),
      precipDiv,
      uvDiv,
      windDiv,
      humidDiv,
    );
  };

  const updateData = async (city) => {
    data = await APIHandler.getData(city);
    render();
  };

  const updateUnit = async (unit) => {
    APIHandler.setUnitGroup(unit);
    updateData();
  };

  return {
    render,
    updateData,
    updateUnit,
  };
};

function addClasses(element, ...classes) {
  if (classes.length !== 0) {
    element.classList.add(...classes);
  }
}

function createHeading(headingType, text, ...classes) {
  const heading = document.createElement(headingType);
  heading.innerHTML = text;
  addClasses(heading, ...classes);

  return heading;
}

function createImg(imgObj, width) {
  const image = document.createElement("img");
  image.src = imgObj;
  if (width) {
    image.width = width;
  }
  return image;
}

function createDiv(...elements) {
  const newDiv = document.createElement("div");
  newDiv.append(...elements);
  return newDiv;
}

function createP(text, ...classes) {
  const para = document.createElement("p");
  para.textContent = text;
  addClasses(para, ...classes);
  return para;
}

export default ScreenController();
