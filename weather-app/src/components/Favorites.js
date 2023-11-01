import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../redux/favoritesActions";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./style/favorites.style.scss";

function Favorites() {
  const favorites = useSelector((state) => state.favorites.favorites);
  const dispatch = useDispatch();

  const handleRemoveFavorite = (city) => {
    Swal.fire({
      icon: "warning",
      title: "Delete",
      text: "You're about to delete this location from your favorite, are you sure ?",
      confirmButtonText: "Yes",
      confirmButtonColor: "rgb(165, 49, 49)",
      showCancelButton: true,
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeFavorite(city));
      }
    });
  };

  return (
    <>
      <h1 className="title">Your Favorites</h1>
      {favorites.length > 0 ? (
        <div className="container mt-3 favorites-container">
          {favorites.map((city) => (
            <div className="favorite-item">
              <button className="favorite-remove" onClick={() => handleRemoveFavorite(city)}>
                <i class="fa-solid fa-xmark"></i>
              </button>
              <Link className="fav_link" to={`/weather/${city.city}`} key={city}>
                <div key={city}>
                  <div className="favorite-info">
                    <div className="favorite-city">{city.city}</div>
                    <div className="favorite-temperature">{city.temperature}°c</div>
                    <div className="favorite-condition">{city.condition}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="no_fav_section">
          <p>
            You don't have any favorites locations for now. <br />
            You can add new cities by clicking on the heart button next to the desired location.
          </p>
        </div>
      )}
    </>
  );
}

export default Favorites;
