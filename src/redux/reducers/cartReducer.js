import {
  buildCreateSlice,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import db from "../../firebase";

const INITIAL_STATE = {
  cartProducts: [],
  totalPrice: 0,
  isLoading: false,
  error: null,
};

// export const cartAsync = createAsyncThunk("cart", async ({ user }) => {
//   var data = [];
//   const unsub = onSnapshot(
//     collection(db, `usersCarts/${user}/myCart`),
//     (snapShot) => {
//       const cartProducts = snapShot.docs.map((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         // console.log(doc.data());
//         return { ...doc.data() };
//       });
//       console.log(cartProducts, "from real time");
//       data = [...cartProducts];
//       return cartProducts;
//     }
//   );
//   return data;
// });

export const addToCartAsync = createAsyncThunk(
  "addToCart",
  async ({ user, product }, thunkAPI) => {
    let { cartProducts } = thunkAPI.getState().cartReducer;
    // console.log(user, product, state, "fosdsd");
    let index = cartProducts.findIndex((item) => item.id === product.id);
    console.log(index);
    if (index === -1) {
      await setDoc(
        doc(
          collection(doc(collection(db, `usersCarts`), `${user}`), "myCart"),
          product.id.toString()
        ),
        {
          ...product,
          qty: 1,
        }
      );
    } else {
      let temp = { ...cartProducts[index] };
      temp.qty++;
      console.log(temp, "temp");
      await setDoc(
        doc(
          collection(doc(collection(db, `usersCarts`), `${user}`), "myCart"),
          product.id.toString()
        ),
        temp
      );
    }
  }
);
export const removeFromCartAsync = createAsyncThunk(
  "removeFromCart",
  async ({ user, id }) => {
    await deleteDoc(
      doc(
        collection(doc(collection(db, `usersCarts`), `${user}`), "myCart"),
        id.toString()
      )
    );
  }
);

export const incrementQuantityAsync = createAsyncThunk(
  "increment/qty",
  async ({ user, id }, thunkAPI) => {
    const { cartProducts } = await thunkAPI.getState().cartReducer;
    const index = cartProducts.findIndex((item) => item.id === id);
    let temp = { ...cartProducts[index] };
    temp.qty++;
    // console.log(temp, "temp");
    await setDoc(
      doc(
        collection(doc(collection(db, `usersCarts`), `${user}`), "myCart"),
        id.toString()
      ),
      temp
    );
  }
);

export const decrementQuantityAsync = createAsyncThunk(
  "increment/qty",
  async ({ user, id }, thunkAPI) => {
    console.log("inside  decre");
    const { cartProducts } = thunkAPI.getState().cartReducer;
    const index = cartProducts.findIndex((item) => item.id === id);
    let temp = { ...cartProducts[index] };
    temp.qty--;
    // console.log(temp, "temp");
    await setDoc(
      doc(
        collection(doc(collection(db, `usersCarts`), `${user}`), "myCart"),
        id.toString()
      ),
      temp
    );
  }
);

export const removeCartProductsAsync = createAsyncThunk(
  "remove/cart-products",
  async ({ user }, thunkAPI) => {
    const { cartProducts } = thunkAPI.getState().cartReducer;
    for (let i = 0; i < cartProducts.length; i++) {
      await deleteDoc(
        doc(db, `usersCarts/${user}/myCart/${cartProducts[i].id}`)
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: INITIAL_STATE,
  reducers: {
    liveSync: (state, action) => {
      state.cartProducts = [...action.payload];
    },
    total: (state) => {
      const total = state.cartProducts.reduce(
        (prev, product) => prev + product.price * product.qty,
        0
      );
      state.totalPrice = total;
    },
  },
});

export const cartReducer = cartSlice.reducer;

export const { liveSync, total } = cartSlice.actions;

export const cartSelector = (state) => state.cartReducer;
