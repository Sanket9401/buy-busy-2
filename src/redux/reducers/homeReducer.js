import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  products: [], //current list of products which are being displayed
  allProducts: [], //all products
  isLoading: false,
  error: null,
};

export const homeAync = createAsyncThunk("home/products", async () => {
  const response = await fetch("https://fakestoreapi.com/products/");
  const data = await response.json();
  return data;
});

const homeSlice = createSlice({
  name: "home/products",
  initialState: INITIAL_STATE,
  reducers: {
    filterBySearch: (state, action) => {
      if (action.payload) {
        const filteredData = state.allProducts.filter((product) =>
          product.title.toLowerCase().includes(action.payload.toLowerCase())
        );
        state.products = filteredData;
      } else {
        state.products = state.allProducts;
      }
    },
    filterMensProducts: (state, action) => {
      if (action.payload) {
        const filteredData = state.allProducts.filter(
          (product) => product.category === "men's clothing"
        );

        state.products.length === state.allProducts.length
          ? (state.products = [...filteredData])
          : (state.products = [...state.products, ...filteredData]);
      } else {
        const filteredData = state.products.filter(
          (product) => product.category !== "men's clothing"
        );

        filteredData.length === 0
          ? (state.products = state.allProducts)
          : (state.products = filteredData);
      }
    },
    filterWomensProducts: (state, action) => {
      if (action.payload) {
        const filteredData = state.allProducts.filter(
          (product) => product.category === "women's clothing"
        );

        state.products.length === state.allProducts.length
          ? (state.products = [...filteredData])
          : (state.products = [...state.products, ...filteredData]);
      } else {
        const filteredData = state.products.filter(
          (product) => product.category !== "women's clothing"
        );

        filteredData.length === 0
          ? (state.products = state.allProducts)
          : (state.products = filteredData);
      }
    },
    filterJeweleryProducts: (state, action) => {
      if (action.payload) {
        const filteredData = state.allProducts.filter(
          (product) => product.category === "jewelery"
        );

        state.products.length === state.allProducts.length
          ? (state.products = [...filteredData])
          : (state.products = [...state.products, ...filteredData]);
      } else {
        const filteredData = state.products.filter(
          (product) => product.category !== "jewelery"
        );

        filteredData.length === 0
          ? (state.products = state.allProducts)
          : (state.products = filteredData);
      }
    },
    filterElectronicsProducts: (state, action) => {
      if (action.payload) {
        const filteredData = state.allProducts.filter(
          (product) => product.category === "electronics"
        );

        state.products.length === state.allProducts.length
          ? (state.products = [...filteredData])
          : (state.products = [...state.products, ...filteredData]);
      } else {
        const filteredData = state.products.filter(
          (product) => product.category !== "electronics"
        );

        filteredData.length === 0
          ? (state.products = state.allProducts)
          : (state.products = filteredData);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(homeAync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(homeAync.fulfilled, (state, action) => {
        state.allProducts = action.payload;
        state.products = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(homeAync.rejected, (state) => {
        state.error = "Failed to fetched product data";
        state.isLoading = false;
      });
  },
});

export const homeReducer = homeSlice.reducer;

export const {
  filterBySearch,
  filterMensProducts,
  filterWomensProducts,
  filterJeweleryProducts,
  filterElectronicsProducts,
} = homeSlice.actions;

export const homeSelector = (state) => state.homeReducer;
