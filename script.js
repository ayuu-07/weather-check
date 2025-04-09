document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const weatherForm = document.getElementById("weather-form")
    const cityInput = document.getElementById("city-input")
    const submitBtn = document.getElementById("submit-btn")
    const loadingMessage = document.getElementById("loading-message")
    const errorMessage = document.getElementById("error-message")
    const weatherContainer = document.getElementById("weather-container")
    const cityName = document.getElementById("city-name")
    const weatherIcon = document.getElementById("weather-icon")
    const temperature = document.getElementById("temperature")
    const description = document.getElementById("description")
    const humidity = document.getElementById("humidity")
    const wind = document.getElementById("wind")
    const searchHistoryContainer = document.getElementById("recent-searches");
    const searchHistoryList = document.getElementById("search-history");
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  
    // API Key
    const API_KEY = "b8c21978d855f8192bd5e460c8ec3be8"; 
  
    // Load recent searches on page load
    updateSearchHistory();

    // Event listener for form submission
    weatherForm.addEventListener("submit", fetchWeather)

    // Event listener for theme toggle
    themeToggleBtn.addEventListener("click", toggleTheme);
  
    async function fetchWeather(e) {
      e.preventDefault()
  
      const city = cityInput.value.trim()
      if (!city) return
  
      // Show loading, hide previous results
      setLoading(true)
  
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
        )
  
        if (!response.ok) {
          throw new Error("City not found or API error")
        }
  
        const data = await response.json()
        displayWeather(data)
        saveToSearchHistory(city); // Save to history
      } catch (err) {
        showError("City not found or API error. Please try again.")
      }
  
      setLoading(false)
    }
  
    function displayWeather(data) {
      // Hide error if visible
      errorMessage.classList.add("hidden")
  
      // Update weather information
      cityName.textContent = data.name
      weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      weatherIcon.alt = data.weather[0].description
      temperature.textContent = `${Math.round(data.main.temp)}°C`
      description.textContent = data.weather[0].description
      humidity.textContent = `Humidity: ${data.main.humidity}%`
      wind.textContent = `Wind: ${data.wind.speed} m/s`
  
      // Show weather container
      weatherContainer.classList.remove("hidden")
    }
  
    function showError(message) {
      errorMessage.textContent = message
      errorMessage.classList.remove("hidden")
      weatherContainer.classList.add("hidden")
    }
  
    function setLoading(isLoading) {
      if (isLoading) {
        loadingMessage.classList.remove("hidden")
        submitBtn.disabled = true
        weatherContainer.classList.add("hidden")
        errorMessage.classList.add("hidden")
      } else {
        loadingMessage.classList.add("hidden")
        submitBtn.disabled = false
      }
    }

    function updateSearchHistory() {
      if (searchHistory.length === 0) {
        searchHistoryContainer.classList.add("hidden");
        return;
      }
    
      searchHistoryContainer.classList.remove("hidden");
      searchHistoryList.innerHTML = searchHistory
        .map((city) => `<li>${city}</li>`)
        .join("");
    }
    
    function saveToSearchHistory(city) {
      if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);
        if (searchHistory.length > 5) searchHistory.pop();
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        updateSearchHistory();
      }
    }
    
    function toggleTheme() {
      document.body.classList.toggle("dark-theme");
    }
  })
