'use strict'

// Elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const cityName = document.getElementById('city-name');
const WeatherInfo = document.getElementById('weather');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const weatherIcon = document.getElementById('weather-icon');
const errorMessage = document.getElementById('error-message');
const currentLocation = document.getElementById('currentBtn');
const dropdownMenu = document.getElementById('dropdown');
const dropdownBtn = document.getElementById('dropdown-btn')

// bringing data from local storage
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
let API_KEY = `9be20a0a88ddfe5a3ee4d50399f89adf`;

updateDropdown();


// Fetch Weather Data
async function fetchWeather(city) {
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();

    // Update UI with weather data
    updateWeatherUI(data);
    errorMessage.classList.add('hidden');
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
  }
}

//Fetching Current Location Weather 

currentLocation.addEventListener('click', function(){
  if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(async (position)=>{
    const { latitude, longitude } = position.coords;
    

    try {                    //callback Async/await
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) throw new Error('Unable to fetch weather for current location');
      const data = await response.json();

      updateWeatherUI(data);
      
      addCityToRecent(data.name);
      fetchForecast(data.name);

    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.classList.remove('hidden');
      weatherDisplay.classList.add('hidden');
    } 
  });
}else {
      errorMessage.textContent = "Geolocation is not supported in your browser";
      errorMessage.classList.remove('hidden');
    }
    
  
  });

// Fetching 5-day forecast
async function fetchForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error(`Error fetching forecast`);
    const data = await response.json();
    console.log(data)
    displayForecast(data); 
  } catch (error) {
    console.error(error.message);
    document.getElementById('error-message').textContent = error.message;
    document.getElementById('error-message').classList.remove('hidden');
  }
}

// Displaying the forecast
function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = ''; 

  
  const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));

  dailyForecasts.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
    const temp = Math.round(day.main.temp);
    const humidity = day.main.humidity;
    const wind = day.wind.speed;
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    // Creating html for the forecast
    const forecastHTML = `
      <div class="p-4 bg-blue-200 rounded-lg shadow-md flex flex-col items-center">
        <p class="font-semibold">${date}</p>
        <img src="${icon}" alt="${day.weather[0].description}" class="w-12 h-12">
        <p class="text-lg font-bold">${temp}°C</p>
        <p class="text-sm">Humidity: ${humidity}%</p>
        <p class="text-sm">Wind: ${wind} m/s</p>
      </div>
    `;

    forecastContainer.innerHTML += forecastHTML;
  });
}


// Update Weather UI
function updateWeatherUI(data) {
  weatherDisplay.classList.remove('hidden');
  cityName.textContent = data.name;
  WeatherInfo.textContent = `${data.weather[0].main}`
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Event Listener
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {fetchWeather(city);
    fetchForecast(city);
  }
});

dropdownBtn.addEventListener('click', () => {
  if (dropdownMenu.classList.contains('hidden')) {
    updateDropdown();
    dropdownMenu.classList.remove('hidden');
  } else {
    dropdownMenu.classList.add('hidden');
  }
});



//updating the drop down with recent searches.
function updateDropdown() {
  dropdownMenu.innerHTML = '';
  recentSearches.forEach((city) => {
    const li = document.createElement('li');
    li.textContent = city;
    li.classList.add('cursor-pointer', 'hover:bg-gray-200', 'p-2', 'rounded-lg');
    li.addEventListener('click', function(){
      fetchWeather(city);
      fetchForecast(city);
    });
    dropdownMenu.appendChild(li);
  });
}

// Add City to Recent Searches
function addCityToRecent(city) {
  if (!recentSearches.includes(city)) {
    recentSearches.push(city);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    updateDropdown();
  }
}


// Call this function after fetching weather
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) addCityToRecent(city);
});