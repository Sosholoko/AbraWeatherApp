// favoritesActions.js

export const addFavorite = (city) => {
  debugger;
  return {
    type: "ADD_FAVORITE",
    payload: city
  };
};
export const removeFavorite = (city) => ({
  type: "REMOVE_FAVORITE",
  payload: city
});
