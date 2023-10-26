import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../redux/favoritesActions";

function Favorites() {
  const favorites = useSelector((state) => state.favorites.favorites);

  const dispatch = useDispatch();

  const handleRemoveFavorite = (city) => {
    dispatch(removeFavorite(city));
  };

  console.log("Favorites:", favorites);

  return (
    <div className="container mt-3">
      <h1>Favorites</h1>
      <ul>
        {favorites.map((city) => (
          <li key={city}>
            {city}
            <button onClick={() => handleRemoveFavorite(city)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favorites;
