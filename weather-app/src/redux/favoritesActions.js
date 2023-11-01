// favoritesActions.js

export const addFavorite = (city, temperature, condition) => {
  return {
    type: "ADD_FAVORITE",
    payload: { city, temperature, condition }
  };
};
export const removeFavorite = (city) => ({
  type: "REMOVE_FAVORITE",
  payload: city
});
