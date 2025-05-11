import "../styles/backgrounds.css";

const themes = {
  // Clear
  "clear-day": "clear-day",
  "clear-night": "clear-night",

  // Partly Cloudy
  "partly-cloudy-day": "partly-cloudy-day",
  "partly-cloudy-night": "partly-cloudy-night",

  // Cloudy & Fog
  cloudy: "cloudy",
  fog: "fog",
  wind: "wind",

  // Rain
  rain: "rain",
  "showers-day": "showers-day",
  "showers-night": "showers-night",

  // Rain-Snow
  "rain-snow": "rain-snow",
  "rain-snow-showers-day": "rain-snow-showers-day",
  "rain-snow-showers-night": "rain-snow-showers-night",

  // Sleet / Hail
  sleet: "sleet",
  hail: "hail",

  // Snow
  snow: "snow",
  "snow-showers-day": "snow-showers-day",
  "snow-showers-night": "snow-showers-night",

  // Thunderstorms
  thunder: "thunder",
  "thunder-rain": "thunder-rain",
  "thunder-showers-day": "thunder-showers-day",
  "thunder-showers-night": "thunder-showers-night",

  // Fallback
  default: "default-theme",
};

const ThemeHandler = () => {
  let theme = "default";
  let prevTheme = "default";
  const getIcon = async (icon) => {
    let imgObj;
    try {
      imgObj = await import("../images/weather/" + icon + ".svg");
    } catch {
      imgObj = null;
    }
    return imgObj;
  };

  const renderTheme = () => {
    const container = document.querySelector(".container");
    if (prevTheme) {
      container.classList.remove(prevTheme);
    }
    container.classList.add(theme);
  };

  const setTheme = (icon) => {
    if (theme in themes) {
      prevTheme = theme;
      theme = icon;
    } else {
      prevTheme = theme;
      theme = "default";
    }
    renderTheme();
  };

  return {
    getIcon,
    setTheme,
  };
};

export default ThemeHandler();
