import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, doc, setDoc } from "firebase/firestore";
import db from "../../firebase";

const INITIAL_STATE = {
  orders: [],
  isLoading: false,
  error: null,
};

export const addToOrdersAsync = createAsyncThunk(
  "async",
  async ({ user, cartProducts }) => {
    await setDoc(
      doc(collection(doc(collection(db, `userOrders`), `${user}`), "myOrders")),
      {
        ...cartProducts,
        date: `${new Date().getFullYear()} - ${(new Date().getMonth() + 1)
          .toString()
          .padStart(2, 0)} - ${new Date().getDate().toString().padStart(2, 0)}`,
      }
    );
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: INITIAL_STATE,
  reducers: {
    allOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const ordersReducer = ordersSlice.reducer;

export const { allOrders } = ordersSlice.actions;

export const ordersSelector = (state) => state.ordersReducer;
