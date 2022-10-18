let userInputFieldEl = document.querySelector(".user-input");
let searchButtonEl = document.querySelector(".search-button");
let rightSideContainerEl = document.querySelector("#right-side");
let fiveDayContainerEl = document.querySelector("#fiveDayContainer");
let todaysDate = moment().format("MMMM Do, YYYY");
let fiveDayHeaderEl = document.querySelector(".five-day-header");
let savedSearchesContainerEl = document.querySelector("#savedSearches");
let previousSearchButton = document.querySelector(".previous-search");
let fiveDayWeatherInfoContainerEl = document.querySelector(
  ".five-day-weather-info-container"
);

let savedLocations = JSON.parse(localStorage.getItem("locations")) || [];
// debugger;

// User inputs their desired city
let searchByCity = async function () {
  event.preventDefault();
  // assign city value to selectedCity
  let selectedCity = userInputFieldEl.value;

  // run getFeaturedWeather with selectedCity
  getFeaturedWeatherToday(selectedCity);
  userInputFieldEl.value = "";
};

// Fetch the Today's API data
let getFeaturedWeatherToday = function (city) {
  // creates api endpoint
  let cityName = city;
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=604e18e2a833081cdf98d51c3b76e026";

  // make a request to the url
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayWeatherToday(data);

        saveUserInput(city);
      });
    } else {
      alert("Please enter a valid city name!");
      userInputFieldEl.value = "";
    }
  });
};

// Take the lat/lon into the new api call
let getFeaturedWeatherFiveDays = function (latitude, longitude) {
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=imperial&exclude=hourly&appid=604e18e2a833081cdf98d51c3b76e026";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayWeatherFiveDays(data);
      });
    } else {
      alert("Error! Please try again.");
    }
  });
};

let displayWeatherFiveDays = function (fiveDayInfo) {
  fiveDayWeatherInfoContainerEl.textContent = "";
  fiveDayHeaderEl.classList.remove("hide-me");
  fiveDayContainerEl.appendChild(fiveDayHeaderEl);
  fiveDayContainerEl.appendChild(fiveDayWeatherInfoContainerEl);

  let dateCounter = 1;

  // create five cards, each holding the info for every day
  for (let i = 1; i < 6; i++) {
    // daily date
    let eachDate = moment()
      .add(dateCounter++, "days")
      .format("MMMM Do, YYYY");
    let eachDateContainer = document.createElement("div");
    eachDateContainer.textContent = eachDate;
    eachDateContainer.classList.add("extra-padding", "date5");

    // daily icon
    let dailyIconCode = fiveDayInfo.daily[i].weather[0].icon;
    console.log(dailyIconCode);

    let iconUrl = "http://openweathermap.org/img/w/" + dailyIconCode + ".png";
    let dailyWeatherIcon = document.createElement("img");
    dailyWeatherIcon.classList.add("weather-icon-img");

    dailyWeatherIcon.setAttribute("src", iconUrl);

    // daily temperatures
    let dailyTemp = document.createElement("div");
    dailyTemp.textContent = "Temp: " + fiveDayInfo.daily[i].temp.day + "°F";
    // daily wind
    let dailyWindSpeed = document.createElement("div");
    dailyWindSpeed.textContent =
      "Wind: " + fiveDayInfo.daily[i].wind_speed + " MPH";
    // daily humidity
    let dailyHumidity = document.createElement("div");
    dailyHumidity.textContent =
      "Humidity: " + fiveDayInfo.daily[i].humidity + "%";

    // Append to a container
    let dailyWeatherStatisticsContainerEl = document.createElement("div");
    dailyWeatherStatisticsContainerEl.classList.add("daily-container", "card");

    let textBackground = document.createElement("div");
    textBackground.classList.add("text-background");

    // add proper background to container
    if (dailyIconCode === "01d") {
      dailyWeatherStatisticsContainerEl.classList.add("sunny-weather");
    } else if (dailyIconCode === "11d") {
      dailyWeatherStatisticsContainerEl.classList.add("thunderstorm-weather");
    } else if (dailyIconCode === "09d" || dailyIconCode === "10d") {
      dailyWeatherStatisticsContainerEl.classList.add("rain-weather");
    } else if (dailyIconCode === "02d") {
      dailyWeatherStatisticsContainerEl.classList.add("few-clouds-weather");
    } else if (dailyIconCode === "03d" || dailyIconCode === "04d") {
      dailyWeatherStatisticsContainerEl.classList.add(
        "scattered-clouds-weather"
      );
    } else if (dailyIconCode === "13d") {
      dailyWeatherStatisticsContainerEl.classList.add("snow-weather");
    } else if (dailyIconCode === "50d") {
      dailyWeatherStatisticsContainerEl.classList.add("mist-weather");
    }
    textBackground.appendChild(eachDateContainer);
    textBackground.appendChild(dailyTemp);
    textBackground.appendChild(dailyWindSpeed);
    textBackground.appendChild(dailyHumidity);

    textBackground.appendChild(dailyWeatherIcon);
    dailyWeatherStatisticsContainerEl.appendChild(textBackground);
    fiveDayWeatherInfoContainerEl.appendChild(
      dailyWeatherStatisticsContainerEl
    );
  }
};

let displayWeatherToday = function (weatherInfo) {
  // clear the container
  rightSideContainerEl.textContent = "";
  rightSideContainerEl.removeAttribute("class");

  rightSideContainerEl.classList.add("day-container");
  // City Name
  let displayCityName = document.createElement("h2");
  displayCityName.textContent = weatherInfo.name;
  displayCityName.classList.add("inline-header");

  rightSideContainerEl.appendChild(displayCityName);
  // Date
  let todaysDateContainer = document.createElement("div");
  todaysDateContainer.textContent = todaysDate;
  todaysDateContainer.classList.add("created-div", "extra-padding");

  rightSideContainerEl.appendChild(displayCityName);
  rightSideContainerEl.appendChild(todaysDateContainer);
  // temperature and weather ICON display
  let weatherTempAndIconDisplay = document.createElement("div");
  let weatherTemperatureDisplay = document.createElement("span");
  weatherTemperatureDisplay.classList.add("created-div");
  weatherTemperatureDisplay.textContent =
    "Temp: " + weatherInfo.main.temp + " °F";
  //append to container
  rightSideContainerEl.appendChild(weatherTemperatureDisplay);

  // weather icon
  // get icon ID
  let iconcode = weatherInfo.weather[0].icon;
  // link to icon
  let iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  let weatherIcon = document.createElement("img");
  weatherIcon.classList.add("weather-icon-img");
  weatherIcon.setAttribute("src", iconUrl);
  // A[[]]

  // wind display
  let weatherWindDisplay = document.createElement("div");
  weatherWindDisplay.classList.add("created-div");

  weatherWindDisplay.textContent = "Wind: " + weatherInfo.wind.speed + " mph";

  rightSideContainerEl.appendChild(weatherWindDisplay);

  // humidity display
  let weatherHumidityDisplay = document.createElement("div");
  weatherHumidityDisplay.classList.add("created-div");

  weatherHumidityDisplay.textContent =
    "Humidity: " + weatherInfo.main.humidity + "%";

  rightSideContainerEl.appendChild(weatherHumidityDisplay);

  rightSideContainerEl.appendChild(weatherIcon);

  // add proper background to container
  if (iconcode === "01d") {
    rightSideContainerEl.classList.add("sunny-weather");
  } else if (iconcode === "11d") {
    rightSideContainerEl.classList.add("thunderstorm-weather");
  } else if (iconcode === "09d" || iconcode === "10d") {
    rightSideContainerEl.classList.add("rain-weather");
  } else if (iconcode === "02d") {
    rightSideContainerEl.classList.add("few-clouds-weather");
  } else if (iconcode === "03d" || iconcode === "04d" || iconcode === "04n") {
    rightSideContainerEl.classList.add("scattered-clouds-weather");
  } else if (iconcode === "13d") {
    rightSideContainerEl.classList.add("snow-weather");
  } else if (iconcode === "50d") {
    rightSideContainerEl.classList.add("mist-weather");
  }
  // Get city's latitude and longitude
  let cityLatitude = weatherInfo.coord.lat;
  let cityLongitude = weatherInfo.coord.lon;

  getFeaturedWeatherFiveDays(cityLatitude, cityLongitude);
};

let createButton = function (text) {
  let savedUserInput = document.createElement("button");
  savedUserInput.classList.add(
    "btn",
    "btn-secondary",
    "city-btn",
    "saved-results",
    "previous-search"
  );

  savedUserInput.textContent = text;
  // append to the container
  savedSearchesContainerEl.appendChild(savedUserInput);

  // save to local storage
  localStorage.setItem("locations", JSON.stringify(savedLocations));

  $(".previous-search").on("click", function () {
    let selectedPreviousSearch = $(this).text().trim();
    getFeaturedWeatherToday(selectedPreviousSearch);
  });
};

let saveUserInput = async function (parameter) {
  console.log("array", savedLocations);
  const userInput = parameter;
  if (savedLocations.length === 0) {
    savedLocations.push(userInput);
    createButton(parameter);
  } else if (savedLocations.length >= 1) {
    console.log("savedLocations", savedLocations);
    const checkIfExists = savedLocations.indexOf(userInput);
    console.log(checkIfExists);
    if (checkIfExists >= 0) {
      console.log("true");
      return;
    } else {
      savedLocations.push(userInput);
      createButton(userInput);
      console.log("false");
    }
  }
};

const clearLocalStorage = function () {
  localStorage.clear();
  const buttons = document.querySelectorAll("button.city-btn");
  buttons.forEach((button) => {
    button.remove();
  });
  const clearBtn = document.querySelector(".clear-btn");
  clearBtn.remove();
  console.log(buttons);
};

let loadUserInput = function () {
  var searchedCities = JSON.parse(localStorage.getItem("locations") || "[]");
  if (searchedCities.length > 0) {
    let clearSearchesButton = document.createElement("button");
    clearSearchesButton.classList.add("btn", "clear-btn", "bottom");
    clearSearchesButton.textContent = "Clear Searches";
    savedSearchesContainerEl.appendChild(clearSearchesButton);
    clearSearchesButton.addEventListener("click", clearLocalStorage);
  }
  for (let j = 0; j < searchedCities.length; j++) {
    let createdPreviousCityButton = document.createElement("button");
    createdPreviousCityButton.textContent = searchedCities[j];
    createdPreviousCityButton.classList.add(
      "btn",
      "btn-secondary",
      "form-control",
      "city-btn",
      "mb-2",
      "previous-search"
    );
    savedSearchesContainerEl.appendChild(createdPreviousCityButton);
    let buttonText = createdPreviousCityButton.outerText;
  }
  $(".previous-search").on("click", function () {
    let selectedPreviousSearch = $(this).text().trim();
    getFeaturedWeatherToday(selectedPreviousSearch);
  });
};

// Event listeners
searchButtonEl.addEventListener("click", searchByCity);

loadUserInput();

// create a button with the text content of the user input and append it below

// When a previous search button is clicked...
// run getFeaturedWeatherToday with the text value of the button as the parameter
