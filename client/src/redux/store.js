// configureStore.js
import { configureStore } from "@reduxjs/toolkit"; // Import configureStore
// import thunk from "redux-thunk";
import { combineReducers } from "redux"; 
import userReducer from "./reducers/userReduer";
import cartReducer from "./reducers/cartReducer";
import itemReducer from "./reducers/itemReducer";

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  item: itemReducer,
});

const store = configureStore({
  reducer: rootReducer, // Use the rootReducer
//   middleware: [thunk], // Apply middleware
});

export default store;
