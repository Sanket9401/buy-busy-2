import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const INITIAL_STATE = {
  user: null,
  isLoading: false,
  error: null,
};

export const signInAsync = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredentials.user.uid;
    } catch (error) {
      console.log("in error");
      return rejectWithValue(error.message);
    }
  }
);

export const signUpAsync = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredentials.user.uid;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logOutAsync = createAsyncThunk("auth/logOut", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth/signIn",
  initialState: INITIAL_STATE,
  reducers: {
    setError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signInAsync.fulfilled, (state, action) => {
        console.log("success");
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        console.log("error");
        state.error = "Invalid Credentials";
        state.isLoading = false;
      })
      .addCase(signUpAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.error = "Something went wrong";
        state.isLoading = false;
      })
      .addCase(logOutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logOutAsync.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      });
  },
});

export const authReducer = authSlice.reducer;

export const { setError } = authSlice.actions;

export const authSelector = (state) => state.authReducer;
