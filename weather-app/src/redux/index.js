import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesReducer";

const store = configureStore({
  reducer: {
    favorites: favoritesReducer
  }
});

export default store;
