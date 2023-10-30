import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../redux/favoritesActions";
import { Link } from "react-router-dom";
import "./style/favorites.style.scss";

function Favorites() {
  const favorites = useSelector((state) => state.favorites.favorites);

  const dispatch = useDispatch();

  const handleRemoveFavorite = (city) => {
    dispatch(removeFavorite(city));
  };

  useEffect(() => {
    console.log(favorites);
  }, [favorites]);

  return (
    <>
      <h1 className="title">Your Favorites</h1>
      <div className="container mt-3 favorites-container">
        {favorites.map((city) => (
          <Link className="fav_link" to={`/weather/${city.city}`} key={city}>
            <div key={city} className="favorite-item">
              <div className="favorite-info">
                <div className="favorite-city">{city.city}</div>
                <div className="favorite-temperature">{city.temperature}</div>
                <div className="favorite-condition">{city.condition}</div>
              </div>
              <div className="favorite-remove" onClick={() => handleRemoveFavorite(city)}>
                &times;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Favorites;
