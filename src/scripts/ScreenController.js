// Modules
import WeatherAPI from "./WeatherAPI.js";
import ThemeHandler from "./Theme.js";

// CSS
import "../styles/currWeather.css";
import "../styles/hourly.css";

// Images
import mapIcon from "../images/icons/mapmarker.svg";
import dateIcon from "../images/icons/calendar.svg";
import precipIcon from "../images/icons/umbrella.svg";
import uvIcon from "../images/icons/uv-index.svg";
import windIcon from "../images/icons/wind.svg";
import humidIcon from "../images/icons/humidity.svg";

const ScreenController = async function () {
  const APIHandler = WeatherAPI;
  const themeHandler = ThemeHandler;

  let currCity = "Delhi";
  let data = await APIHandler.getData(currCity);

  const render = async (dayNumber = 0) => {
    if (!data) {
      return;
    }

    // Selecting correct data source
    const day = data.days[dayNumber];
    let currHour = 0;
    if (isToday(dayNumber)) {
      currHour = getHoursByTimezone(data.timezone);
    }

    const main = document.querySelector("main");
    main.innerHTML = "";

    const currDataDiv = createDiv();
    currDataDiv.classList.add("current-weather");

    const currDataLeft = createDiv();
    currDataLeft.classList.add("left");

    const currDataRight = createDiv();
    currDataRight.classList.add("right");

    const statsData = createDiv();
    statsData.classList.add("stats");

    // Updating theme & icon
    let dataSource;
    if (isToday(dayNumber)) {
      dataSource = day.hours[currHour];
    } else {
      dataSource = day;
    }
    themeHandler.setTheme(dataSource.icon);
    const imgObj = (await themeHandler.getIcon(dataSource.icon)).default;
    currDataRight.appendChild(createImg(imgObj));

    // Writing Current Data (or average data of the day if not today)
    const locH3 = createHeading("h3", data.address);
    const mapImg = createImg(mapIcon, 20);
    locH3.prepend(mapImg);

    const dateH3 = createHeading(
      "h3",
      getDateByTimezone(data.days[dayNumber].datetime, data.timezone),
    );
    const dateImg = createImg(dateIcon, 20);
    dateH3.prepend(dateImg);

    currDataLeft.append(
      locH3,
      dateH3,
      createHeading(
        "h1",
        `${Math.floor(dataSource.temp)}&deg;${APIHandler.getTempUnit()}`,
        "temp",
      ),
      createHeading("h2", dataSource.conditions),
      createHeading(
        "h3",
        `Feels like: ${Math.floor(dataSource.feelslike)}&deg;${APIHandler.getTempUnit()}`,
      ),
      createHeading("h3", data.resolvedAddress),
    );

    // Writing Stats data
    const descP = createP(day.description, "description");
    const precipDiv = createDiv(
      createImg(precipIcon, 30),
      createP("Precipitation %"),
      createP(dataSource.precipprob),
    );
    const uvDiv = createDiv(
      createImg(uvIcon, 30),
      createP("UV Index"),
      createP(dataSource.uvindex),
    );
    const windDiv = createDiv(
      createImg(windIcon, 30),
      createP("Wind Speed"),
      createP(dataSource.windspeed),
    );
    const humidDiv = createDiv(
      createImg(humidIcon, 30),
      createP("Humidity %"),
      createP(dataSource.humidity),
    );

    statsData.append(createDiv(descP), precipDiv, uvDiv, windDiv, humidDiv);
    currDataDiv.append(currDataLeft, currDataRight);

    const hourlyDiv = createDiv();
    hourlyDiv.classList.add("hourly");

    for (let i = currHour; i < 24; i++) {
      const hourData = data.days[dayNumber].hours[i];
      const hourCardDiv = createDiv(
        createHeading("h3", hourData.datetime.slice(0, 5)),
        createImg((await ThemeHandler.getIcon(hourData.icon)).default, 50),
        createHeading(
          "h3",
          `${Math.floor(hourData.temp)}&deg;${APIHandler.getTempUnit()}`,
        ),
        createDiv(
          createDiv(createImg(uvIcon, 20), createP(hourData.uvindex)),
          createDiv(
            createImg(precipIcon, 20),
            createP(Math.floor(hourData.precipprob) + "%"),
          ),
        ),
      );
      hourCardDiv.classList.add("hour-card");
      hourlyDiv.appendChild(hourCardDiv);
    }

    main.append(currDataDiv, statsData, hourlyDiv);
  };

  const updateData = async (city) => {
    const main = document.querySelector("main");
    main.classList.add("loading");
    try {
      data = await APIHandler.getData(city);
      currCity = city;
      render();
    } finally {
      setTimeout(() => main.classList.remove("loading"), 1000);
    }
  };

  const updateUnit = async (unit) => {
    APIHandler.setUnitGroup(unit);
    updateData(currCity);
  };

  return {
    render,
    updateData,
    updateUnit,
  };
};

function isToday(dayNumber) {
  return dayNumber === 0;
}

function getHoursByTimezone(timezone) {
  const options = {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  };
  const formattedTime = new Date().toLocaleString("en-US", options);
  return parseInt(formattedTime);
}

function getDateByTimezone(dateStr, timezone) {
  const options = {
    timeZone: timezone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour12: false,
  };
  const formattedDate = new Date(dateStr).toLocaleString("en-US", options);
  return formattedDate;
}

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
