import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addFavorite } from "../redux/favoritesActions";

function Weather() {
  const dispatch = useDispatch();

  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const apiKey = "EKkpV7wi1FyMUHGQPzYGUDwcrbDjKsx4";

  const handleAddFavorite = () => {
    debugger;
    if (!city || suggestions.length === 0) return;
    dispatch(addFavorite(city));
  };

  const searchWeather = async () => {
    try {
      const autoCompleteResponse = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete`, {
        params: {
          apikey: apiKey,
          q: city
        }
      });

      if (autoCompleteResponse.data && autoCompleteResponse.data[0]) {
        const locationKey = autoCompleteResponse.data[0].Key;
        const currentConditionsResponse = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}`, {
          params: {
            apikey: apiKey
          }
        });
        setWeatherData(currentConditionsResponse.data[0]);

        const fiveDayForecastResponse = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`, {
          params: {
            apikey: apiKey,
            metric: true // Set to false for Fahrenheit, true for Celsius
          }
        });
        setForecastData(fiveDayForecastResponse.data.DailyForecasts);
      } else {
        console.error("City not found.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleCityChange = (e) => {
    const inputCity = e.target.value;
    setCity(inputCity);

    if (inputCity) {
      axios
        .get(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete`, {
          params: {
            apikey: apiKey,
            q: inputCity
          }
        })
        .then((response) => {
          setSuggestions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
        });
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="container mt-3">
      <h1>Weather App</h1>
      <input type="text" value={city} onChange={handleCityChange} placeholder="Enter city" />
      <button onClick={searchWeather}>Search</button>

      <ul>
        {suggestions.map((item) => (
          <li key={item.Key} onClick={() => setCity(item.LocalizedName)}>
            {item.LocalizedName}
          </li>
        ))}
      </ul>

      {weatherData && (
        <div>
          <h2>{city}</h2>
          <p>Temperature: {weatherData.Temperature.Metric.Value}°C</p>
          <p>Condition: {weatherData.WeatherText}</p>
          <button onClick={handleAddFavorite}>Add to Favorites</button>
        </div>
      )}

      {forecastData.length > 0 && (
        <div>
          <h2>5-Day Forecast</h2>
          <ul>
            {forecastData.map((day, index) => (
              <li key={index}>
                {day.Date} - High: {day.Temperature.Maximum.Value}°C, Low: {day.Temperature.Minimum.Value}°C
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Weather;
