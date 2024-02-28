import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "./reducers/cartReducer";
import { authReducer } from "./reducers/authReducer";
import { homeReducer } from "./reducers/homeReducer";
import { ordersReducer } from "./reducers/ordersReducer";

export const store = configureStore({
  reducer: {
    authReducer,
    homeReducer,
    cartReducer,
    ordersReducer,
  },
});
