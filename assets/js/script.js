let userInputFieldEl = document.querySelector(".user-input")
let searchButtonEl = document.querySelector(".search-button")

let searchByCity = function() {
    event.preventDefault()

    // assign city value to selectedCity
    let selectedCity = userInputFieldEl.value

    // run getFeaturedWeather with selectedCity
    getFeaturedWeather(selectedCity)
}

// Fetch the API data
let getFeaturedWeather = function(city) {
    // creates api endpoint
    let cityName = city
    let apiUrl =  'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=604e18e2a833081cdf98d51c3b76e026'  

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {            
            console.log(data);
        })
    })     
}   


searchButtonEl.addEventListener("click", searchByCity)