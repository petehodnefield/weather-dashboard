let userInputFieldEl = document.querySelector(".user-input")
let searchButtonEl = document.querySelector(".search-button")
let rightSideContainerEl = document.querySelector("#right-side")
let fiveDayContainerEl = document.querySelector("#fiveDayContainer")
let todaysDate = moment().format(    'MMMM Do YYYY');
let fiveDayHeaderEl = document.querySelector(".five-day-header")



let searchByCity = function() {
    event.preventDefault()
    // assign city value to selectedCity
    let selectedCity = userInputFieldEl.value

    // run getFeaturedWeather with selectedCity
    getFeaturedWeatherToday(selectedCity)
}

// Fetch the Today's API data
let getFeaturedWeatherToday = function(city) {
    // creates api endpoint
    let cityName = city
    let apiUrl =  'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=604e18e2a833081cdf98d51c3b76e026'  

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {            
                displayWeatherToday(data);
                console.log(data)
            })
        }
        else {
            alert("Please enter a valid city name!")
            userInputFieldEl.value = ''
        }
    })     
}

// Take the lat/lon into the new api call
let getFeaturedWeatherFiveDays = function(latitude, longitude) {
    let apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&exclude=hourly&appid=604e18e2a833081cdf98d51c3b76e026'
        
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayWeatherFiveDays(data)
                console.log(data)
            })
        }
        else {
            alert("Error! Please try again.")
        }
    })
}

let displayWeatherFiveDays = function(fiveDayInfo) {
    fiveDayHeaderEl.classList.remove("hide-me")
    let dateCounter = 1

    // create five cards, each holding the info for every day
    for(let i = 1; i < 6; i++) {
        // daily date
        let eachDate = moment().add(dateCounter++, 'days').format('MMMM Do YYYY')
        let eachDateContainer = document.createElement("div")
        eachDateContainer.textContent = eachDate
        
        
        // daily icon
        let dailyIconCode = fiveDayInfo.daily[i].weather[0].icon;
        console.log(dailyIconCode)
        let iconUrl = "http://openweathermap.org/img/w/" + dailyIconCode + ".png";
        let dailyWeatherIcon = document.createElement('img')
        dailyWeatherIcon.classList.add("weather-icon-img")
        dailyWeatherIcon.setAttribute("src", iconUrl)

        // daily temperatures
        let dailyTemp = document.createElement("div")
        dailyTemp.textContent = "Temp: " + fiveDayInfo.daily[i].temp.day + "°F"
        // daily wind
        let dailyWindSpeed = document.createElement("div")
        dailyWindSpeed.textContent = "Wind: " + fiveDayInfo.daily[i].wind_speed + " MPH"
        // daily humidity
        let dailyHumidity = document.createElement("div")
        dailyHumidity.textContent = "Humidity: " + fiveDayInfo.daily[i].humidity + "%"

        // Append to a container
        let dailyWeatherStatisticsContainerEl = document.createElement("div")
        dailyWeatherStatisticsContainerEl.classList.add("daily-container")
        dailyWeatherStatisticsContainerEl.appendChild(eachDateContainer)
        dailyWeatherStatisticsContainerEl.appendChild(dailyWeatherIcon)
        dailyWeatherStatisticsContainerEl.appendChild(dailyTemp)
        dailyWeatherStatisticsContainerEl.appendChild(dailyWindSpeed)
        dailyWeatherStatisticsContainerEl.appendChild(dailyHumidity)
        fiveDayContainerEl.appendChild(dailyWeatherStatisticsContainerEl)
    }

    
}


let displayWeatherToday = function(weatherInfo) {
    // City Name
    let displayCityName = document.createElement("h2")
    displayCityName.textContent =  weatherInfo.name
    displayCityName.classList.add("inline-header")

    rightSideContainerEl.appendChild(displayCityName)
    // Date
    let todaysDateContainer = document.createElement("span")
    todaysDateContainer.textContent = todaysDate

     // create container for cityName and data
     let nameAndDateContainerEl = document.createElement("div")

     nameAndDateContainerEl.appendChild(displayCityName)
     nameAndDateContainerEl.appendChild(todaysDateContainer)


    rightSideContainerEl.appendChild(nameAndDateContainerEl)   
    // temperature and weather ICON display
    let weatherTempAndIconDisplay = document.createElement("div")
    let weatherTemperatureDisplay = document.createElement("span")
    weatherTemperatureDisplay.classList.add("created-div")
    weatherTemperatureDisplay.textContent = "Temp: " + weatherInfo.main.temp + " °F"
    //append to container
    rightSideContainerEl.appendChild(weatherTemperatureDisplay)

    // weather icon
    // get icon ID
    let iconcode = weatherInfo.weather[0].icon;
    // link to icon
    let iconUrl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    let weatherIcon = document.createElement('img')
    weatherIcon.classList.add("weather-icon-img")
    weatherIcon.setAttribute("src", iconUrl)
    // A[[]]
    rightSideContainerEl.appendChild(weatherIcon)

    // wind display
    let weatherWindDisplay = document.createElement("div")
    weatherWindDisplay.classList.add("created-div")

    weatherWindDisplay.textContent = "Wind speed: " + weatherInfo.wind.speed + " mph"

    rightSideContainerEl.appendChild(weatherWindDisplay)

    // humidity display
    let weatherHumidityDisplay = document.createElement("div")
    weatherHumidityDisplay.classList.add("created-div")

    weatherHumidityDisplay.textContent = "Humidity: " + weatherInfo.main.humidity

    rightSideContainerEl.appendChild(weatherHumidityDisplay)

    // Get city's latitude and longitude
    let cityLatitude = weatherInfo.coord.lat
    let cityLongitude = weatherInfo.coord.lon

    getFeaturedWeatherFiveDays(cityLatitude, cityLongitude)

}

// Event listeners
searchButtonEl.addEventListener("click", searchByCity)