import { configureStore } from "@reduxjs/toolkit";
import Auth from "./Auth/auth.slice";
const store = configureStore({
  reducer: {
    auth: Auth,
  },
  devTools: true,
});

export default store;
