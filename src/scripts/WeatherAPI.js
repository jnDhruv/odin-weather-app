const units = {
  metric: "C",
  us: "F",
};

function WeatherAPI() {
  const KEY = "LWZARZGDDUQZRGQQCC3PLXZ22";
  const baseURL =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

  let unitGroup = "metric";
  const getData = async function (location) {
    const url = baseURL + location + "?key=" + KEY + "&unitGroup=" + unitGroup;
    const response = await fetch(url, { mode: "cors" });
    const data = await response.json();
    return await processData(data);
  };

  const setUnitGroup = (group) => (unitGroup = group);

  const getTempUnit = () => units[unitGroup];

  return { getData, setUnitGroup, getTempUnit };
}

const processData = async function (data) {
  const { address, resolvedAddress, timezone } = data;

  const output = { address, resolvedAddress, timezone };

  output.days = await data.days.slice(0, 7).map((day) => processDay(day));

  return output;
};

function processDay(dayObj) {
  const {
    datetime,
    tempmax,
    tempmin,
    temp,
    feelslike,
    precipprob,
    conditions,
    description,
    icon,
    hours,
  } = dayObj;

  return {
    datetime,
    tempmax,
    tempmin,
    temp,
    feelslike,
    precipprob,
    conditions,
    description,
    icon,
    hours: hours.map((hour) => processHour(hour)),
  };
}

function processHour(hour) {
  const {
    datetime,
    temp,
    conditions,
    feelslike,
    uvindex,
    precipprob,
    humidity,
    windspeed,
    icon,
  } = hour;
  return {
    datetime,
    temp,
    conditions,
    feelslike,
    uvindex,
    precipprob,
    humidity,
    windspeed,
    icon,
  };
}

export default WeatherAPI();
