const initialState = {
  favorites: []
};

const favoritesReducer = (state = initialState, action) => {
  debugger;
  switch (action.type) {
    case "ADD_FAVORITE":
      return {
        ...state,
        favorites: [
          ...state.favorites,
          {
            city: action.payload.city,
            temperature: action.payload.temperature,
            condition: action.payload.condition
          }
        ]
      };
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
