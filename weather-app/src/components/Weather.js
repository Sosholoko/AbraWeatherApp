import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite } from "../redux/favoritesActions";
import "./style/weather.style.scss";

function Weather() {
  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorites.favorites);

  useEffect(() => {
    console.log(favorites);
  }, [favorites]);

  const [city, setCity] = useState("Tel Aviv");
  const [selectedCity, setSelectedCity] = useState("Tel Aviv");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const apiKey2 = "EKkpV7wi1FyMUHGQPzYGUDwcrbDjKsx4";
  const apiKey = "c7EKVXLuHyAffsQmLZvGTn2MDriFUvEm";

  useEffect(() => {
    // Fetch weather data for "Tel Aviv" when the component mounts
    searchWeather(selectedCity);
  }, [selectedCity]);

  const handleAddFavorite = () => {
    if (!city || suggestions.length === 0) return;
    dispatch(addFavorite(city));
  };

  const searchWeather = async (city) => {
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
            apikey: apiKey,
            metric: true
          }
        });
        setWeatherData(currentConditionsResponse.data[0]);
        setSelectedCity(city);
        setIsSuggestionsVisible(false);

        const fiveDayForecastResponse = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`, {
          params: {
            apikey: apiKey,
            metric: true
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
          setIsSuggestionsVisible(true);
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
        });
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (suggestedCity) => {
    // Handle click on a suggestion
    setCity(suggestedCity);
    searchWeather(suggestedCity);
  };

  return (
    <div className="weather_container">
      <div className="container mt-3">
        <h1>Weather App</h1>
        <div className="searchField">
          <input type="text" value={city} onChange={handleCityChange} placeholder="Enter city" />
          <button onClick={() => searchWeather(city)}>Search</button>
        </div>

        {isSuggestionsVisible && (
          <ul className="autocomplete_list">
            {suggestions.map((item) => (
              <li key={item.Key} onClick={() => handleSuggestionClick(item.LocalizedName)}>
                {item.LocalizedName}
              </li>
            ))}
          </ul>
        )}

        {weatherData && (
          <div>
            <h2>{selectedCity}</h2>
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
    </div>
  );
}

export default Weather;
