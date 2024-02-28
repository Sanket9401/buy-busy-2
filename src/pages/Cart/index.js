import styles from "./style.module.css";
import Loader from "../../components/Loader";
import { useEffect, useState } from "react";
import addLogo from "../../assets/images/increment.png";
import remove from "../../assets/images/decrement.png";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import {
  cartSelector,
  incrementQuantityAsync,
  decrementQuantityAsync,
  removeFromCartAsync,
  removeCartProductsAsync,
  total,
} from "../../redux/reducers/cartReducer";
import { liveSync } from "../../redux/reducers/cartReducer";
import db from "../../firebase";
import { addToOrdersAsync } from "../../redux/reducers/ordersReducer";
import { toast } from "react-toastify";

export default function Cart() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(authSelector);
  const { cartProducts, totalPrice } = useSelector(cartSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const unsub = onSnapshot(
        collection(db, `usersCarts/${user}/myCart`),
        (snapShot) => {
          const cartProductsData = snapShot.docs.map((doc) => {
            // console.log(doc.data());
            return { ...doc.data() };
          });
          console.log(cartProductsData, "from real time");
          dispatch(liveSync(cartProductsData));
          dispatch(total());
          setIsLoading(false);
        }
      );
    }
    fetchData();
  }, []);

  if (cartProducts.length === 0) {
    return <h1>Cart Is Empty</h1>;
  }

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.productsWrapper}>
            <div className={styles.filterContainer}>
              <aside>
                <span>Total Price: {totalPrice.toFixed(2)}/-</span>

                <Link to="/my-orders">
                  <button
                    onClick={() => {
                      dispatch(addToOrdersAsync({ user, cartProducts }));
                      dispatch(removeCartProductsAsync({ user }));
                      toast.success("Purchased !!!", { autoClose: 500 });
                    }}
                  >
                    Purchase
                  </button>
                </Link>
              </aside>
            </div>
            <div className={styles.products}>
              {cartProducts.map((product) => (
                <div className={styles.product} key={product.id}>
                  <div className={styles.imageContainer}>
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className={styles.productTitle}>
                    <p>{product.title}</p>
                  </div>
                  <div className={styles.productPrice}>
                    <p>₹{product.price}</p>
                  </div>
                  <span>
                    <img
                      src={addLogo}
                      alt="Increment"
                      onClick={() => {
                        const id = product.id;
                        dispatch(incrementQuantityAsync({ user, id }));
                      }}
                    />
                    Qty. {product.qty}
                    <img
                      src={remove}
                      alt="Decrement"
                      onClick={() => {
                        const id = product.id;
                        if (product.qty >= 2) {
                          dispatch(decrementQuantityAsync({ user, id }));
                        } else {
                          dispatch(removeFromCartAsync({ user, id }));
                        }
                      }}
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const id = product.id;
                      dispatch(removeFromCartAsync({ user, id }));
                      toast.success("Product removed from cart !!!", {
                        autoClose: 500,
                      });
                    }}
                  >
                    Remove From Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
