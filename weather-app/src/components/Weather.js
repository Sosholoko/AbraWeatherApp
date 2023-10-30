import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite } from "../redux/favoritesActions";
import { useParams } from "react-router-dom";
import "./style/weather.style.scss";

function Weather() {
  function importAllImages() {
    const images = {};
    const requireContext = require.context("./images/weatherIcons", false, /\.(png|jpg|jpeg)$/);
    requireContext.keys().forEach((filename) => {
      const imageName = filename.replace(/^.*[\\/]/, "").replace(/\..*$/, ""); // Extract image name
      images[imageName] = requireContext(filename);
    });
    return images;
  }

  const weatherIcons = importAllImages();

  const dispatch = useDispatch();
  const { city: cityParam } = useParams();
  const [city, setCity] = useState("Tel Aviv");
  const [selectedCity, setSelectedCity] = useState("Tel Aviv");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const apiKey3 = "EKkpV7wi1FyMUHGQPzYGUDwcrbDjKsx4";
  const apiKey2 = "c7EKVXLuHyAffsQmLZvGTn2MDriFUvEm";
  const apiKey = "AJ9rOotB2dU77ZvwNCdIbzL0zoBfBb3x";

  useEffect(() => {
    console.log(forecastData);
  }, [forecastData]);

  useEffect(() => {
    if (cityParam) {
      setSelectedCity(cityParam);
      setCity(cityParam);
      searchWeather(cityParam);
    }
  }, [cityParam]);

  useEffect(() => {
    if (!weatherData && !cityParam) {
      searchWeather(selectedCity);
    }
  }, [selectedCity, weatherData]);

  useEffect(() => {
    if (weatherData && typeof weatherData.IsDayTime === "boolean") {
      const body = document.body;
      if (weatherData.IsDayTime) {
        body.classList.add("day-time-background");
        body.classList.remove("night-time-background");
      } else {
        body.classList.add("night-time-background");
        body.classList.remove("day-time-background");
      }
    }
  }, [weatherData]);

  const handleAddFavorite = () => {
    if (!city && !suggestions.includes("Tel Aviv")) return;
    dispatch(addFavorite(city, weatherData.Temperature.Metric.Value, weatherData.WeatherText || "Tel Aviv"));
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
    setCity(suggestedCity);
    searchWeather(suggestedCity);
  };

  return (
    <div className="weather_container">
      <div className="container mt-3">
        <div className="top_part">
          {weatherData && (
            <div className="city_info">
              <div className="city_label">
                <h1>{selectedCity}</h1>
                <button className="add-to-favorites" onClick={handleAddFavorite}>
                  <span>&#43;</span> {/* Plus sign entity */}
                </button>
              </div>

              <p className="actual_date">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}{" "}
                | {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
              <div className="conditions_part">
                <div className="temp_text">
                  <p className="temparature_text">
                    {weatherData.Temperature.Metric.Value}
                    <span style={{ fontSize: "20px" }}>°C</span>
                  </p>
                  <p className="condition_text">{weatherData.WeatherText}</p>
                </div>

                <div style={{ height: "100px", width: "100px", marginTop: "10%" }}>
                  <img src={weatherIcons[`icon${weatherData.WeatherIcon}`]} alt="" style={{ height: "100px", width: "150px" }} />
                </div>
              </div>
            </div>
          )}

          <div className="search_part">
            <div className="searchField">
              <input type="text" value={city} onChange={handleCityChange} placeholder="Enter city name" />
              <button onClick={() => searchWeather(city)}>
                <i class="fa-solid fa-heart"></i>Search
              </button>
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
          </div>
        </div>

        {forecastData.length > 0 && (
          <div className="forecast-container">
            {forecastData.map((day, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-day">{new Date(day.Date).toLocaleDateString("en-US", { weekday: "long" })}</div>

                {weatherData.IsDayTime ? (
                  <>
                    <img src={weatherIcons[`icon${day.Day.Icon}`]} alt="" style={{ height: "40px", width: "60px" }} />
                    <div className="forecast-temperature">
                      {day.Temperature.Minimum.Value}° - {day.Temperature.Maximum.Value}°
                    </div>
                    <p>{day.Day.IconPhrase}</p>
                  </>
                ) : (
                  <>
                    <img src={weatherIcons[`icon${day.Night.Icon}`]} alt="" style={{ height: "40px", width: "60px" }} />
                    <div className="forecast-temperature">
                      {day.Temperature.Minimum.Value}° - {day.Temperature.Maximum.Value}°
                    </div>
                    <p>{day.Night.IconPhrase}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
