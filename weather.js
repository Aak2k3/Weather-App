'use strict'
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

// Elements
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherDisplay = document.getElementById('weather-display');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const weatherIcon = document.getElementById('weather-icon');
const errorMessage = document.getElementById('error-message');
const currentLocation = document.getElementById('currentBtn');


// Fetch Weather Data
async function fetchWeather(city) {
  let API_KEY = `9be20a0a88ddfe5a3ee4d50399f89adf`;
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

// Update Weather UI
function updateWeatherUI(data) {
  weatherDisplay.classList.remove('hidden');
  cityName.textContent = data.name;
  temperature.textContent = `Temperature: ${data.main.temp}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Event Listener
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});
