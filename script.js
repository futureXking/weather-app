const apiKey = "392a3e087133a4410eeb7a1348474d3f"; 

function getCitySuggestions() {
  const query = document.getElementById("cityInput").value.trim();
  const suggestionsBox = document.getElementById("suggestions");
  if (query.length < 2) {
    suggestionsBox.innerHTML = "";
    return;
  }

  fetch(https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey})
    .then(res => res.json())
    .then(data => {
      suggestionsBox.innerHTML = "";
      data.forEach(city => {
        const li = document.createElement("li");
        li.textContent = ${city.name}, ${city.country};
        li.onclick = () => {
          document.getElementById("cityInput").value = city.name;
          suggestionsBox.innerHTML = "";
        };
        suggestionsBox.appendChild(li);
      });
    });
}

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city.");
    return;
  }

  const currentUrl = https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric;
  const forecastUrl = https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric;

  // Current Weather
  fetch(currentUrl)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      const icon = data.weather[0].icon;
      const iconUrl = https://openweathermap.org/img/wn/${icon}@2x.png;

      const result = `
        <img src="${iconUrl}" />
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>🌡 Temp: ${data.main.temp}°C</p>
        <p>☁ ${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind: ${data.wind.speed} m/s</p>
      `;
      document.getElementById("weatherResult").innerHTML = result;

      // 🌈 Change background based on weather
      const weatherMain = data.weather[0].main.toLowerCase();
      const body = document.body;
      body.className = ''; // Reset all
      if (weatherMain.includes("cloud")) {
        body.classList.add("cloudy");
      } else if (weatherMain.includes("rain")) {
        body.classList.add("rainy");
      } else if (weatherMain.includes("clear")) {
        body.classList.add("clear");
      } else if (weatherMain.includes("sun")) {
        body.classList.add("sunny");
      } else if (weatherMain.includes("thunderstorm")) {
        body.classList.add("thunderstorm");
      } else if (weatherMain.includes("snow")) {
        body.classList.add("snow");
      } else if (weatherMain.includes("mist") || weatherMain.includes("fog")) {
        body.classList.add("mist");
      } else {
        body.classList.add("clear"); // fallback
      }
    })
    .catch(err => {
      document.getElementById("weatherResult").innerHTML = <p style="color:red;">${err.message}</p>;
    });

  // 5-Day Forecast
  fetch(forecastUrl)
    .then(res => res.json())
    .then(data => {
      const forecastContainer = document.getElementById("forecastContainer");
      forecastContainer.innerHTML = "<h3>5-Day Forecast</h3>";
      const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00")); // Midday data

      forecastList.forEach(day => {
        const date = new Date(day.dt * 1000);
        const iconUrl = https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png;

        const card = `
          <div class="forecast-card">
            <p>${date.toDateString().split(" ").slice(0, 3).join(" ")}</p>
            <img src="${iconUrl}" alt="icon" />
            <p>${day.main.temp.toFixed(1)}°C</p>
          </div>
        `;
        forecastContainer.innerHTML += card;
      });
    });
}