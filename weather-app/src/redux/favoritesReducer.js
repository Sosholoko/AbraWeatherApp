const initialState = {
  favorites: []
};

const favoritesReducer = (state = initialState, action) => {
  debugger;
  switch (action.type) {
    case "ADD_FAVORITE":
      return { ...state, favorites: [...state.favorites, action.payload] };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((item) => item !== action.payload)
      };
    default:
      return state;
  }
};

export default favoritesReducer;
