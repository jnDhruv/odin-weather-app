function WeatherAPI() {
  const KEY = "LWZARZGDDUQZRGQQCC3PLXZ22";
  const baseURL =
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

  const getData = async function (location) {
    const url = baseURL + location + "?key=" + KEY;
    const response = await fetch(url, { mode: "cors" });
    const data = await response.json();
    return await processData(data);
  };

  return { getData };
}

const processData = async function (data) {
  const {
    address,
    resolvedAddress,
    description,
  } = data;

  const output = { address, resolvedAddress, description };

  output.currentConditions = await processCurrent(data.currentConditions);
  output.days = await data.days.slice(0, 7).map((day) => processDay(day));

  return output;
};

async function processCurrent(current) {
  const {
    datetime,
    temp,
    feelslike,
    precipprob,
    icon,
    conditions,
    uvindex,
    humidity,
    windspeed,
  } = current;

  return {
    datetime,
    temp,
    feelslike,
    icon,
    conditions,
    precipprob,
    uvindex,
    windspeed,
    humidity,
  };
}

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

async function processHour(hour) {
  const { datetime, temp, precipprob, icon } = hour;
  return { datetime, temp, precipprob, icon };
}

export default WeatherAPI();
