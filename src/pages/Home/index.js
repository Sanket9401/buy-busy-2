import React, { useEffect, useMemo, useState } from "react";
import styles from "./style.module.css";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, signInAsync } from "../../redux/reducers/authReducer";
import {
  filterMensProducts,
  filterWomensProducts,
  filterJeweleryProducts,
  filterElectronicsProducts,
  homeAync,
  homeSelector,
  filterBySearch,
} from "../../redux/reducers/homeReducer";
import { addToCartAsync, totalPrice } from "../../redux/reducers/cartReducer";
import { toast } from "react-toastify";

export const Home = () => {
  const { user } = useSelector(authSelector);
  const { products, allProducts, isLoading } = useSelector(homeSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(homeAync());
    const data = localStorage.getItem("auth");
    const authData = JSON.parse(data);
    console.log(authData, "from local");
    if (authData) {
      dispatch(signInAsync(authData));
    }
  }, []);

  const memoizedProductsData = useMemo(() => allProducts, [allProducts]);

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Search By Name"
              onChange={(e) => dispatch(filterBySearch(e.target.value))}
            />
          </div>
          <div className={styles.productsWrapper}>
            <div className={styles.filterContainer}>
              <aside>
                <p>Category</p>
                <div className={styles.categories}>
                  <div>
                    <input
                      type="checkbox"
                      id="mensClothing"
                      name="mensClothing"
                      onChange={(e) =>
                        dispatch(filterMensProducts(e.target.checked))
                      }
                    />
                    <label htmlFor="mensClothing">Men's Clothing</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="womensClothing"
                      name="womensClothing"
                      onChange={(e) =>
                        dispatch(filterWomensProducts(e.target.checked))
                      }
                    />
                    <label htmlFor="womensClothing">Women's Clothing</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="jewelery"
                      name="jewelery"
                      onChange={(e) =>
                        dispatch(filterJeweleryProducts(e.target.checked))
                      }
                    />
                    <label htmlFor="jewelery">Jewelery</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="electronics"
                      name="electronics"
                      onChange={(e) =>
                        dispatch(filterElectronicsProducts(e.target.checked))
                      }
                    />
                    <label htmlFor="electronics">Electronics</label>
                  </div>
                </div>
              </aside>
            </div>
            <div className={styles.products}>
              {products.map((product, index) => (
                <div className={styles.product} key={index}>
                  <div className={styles.imageContainer}>
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className={styles.productTitle}>
                    <p>{product.title}</p>
                  </div>
                  <div className={styles.productPrice}>
                    <p>₹{product.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      dispatch(addToCartAsync({ user, product }));
                      toast.success("Product added to cart !!!", {
                        autoClose: 500,
                      });
                    }}
                  >
                    <Link to={user ? "/" : "sign-in"}>Add To Cart</Link>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
