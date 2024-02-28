import { useEffect } from "react";
import styles from "./style.module.css";
import { collection, onSnapshot } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import { allOrders, ordersSelector } from "../../redux/reducers/ordersReducer";
import db from "../../firebase";

export default function MyOrders() {
  const { user } = useSelector(authSelector);
  const { orders } = useSelector(ordersSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchOrdersData() {
      const unsub = onSnapshot(
        collection(db, `userOrders/${user}/myOrders`),
        (snapShot) => {
          const orders = snapShot.docs.map((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.data());
            return { ...doc.data() };
          });
          console.log(orders, "from real time orders");
          dispatch(allOrders(orders));
        }
      );
    }
    fetchOrdersData();
  }, []);

  if (orders.length === 0) {
    return <h1>You don't have any orders yet</h1>;
  }

  return (
    <div className={styles.wrapper}>
      <h1>Your Orders</h1>
      {orders.map((order, index) => (
        <div className={styles.orderDetails} key={index}>
          <h2>Ordered On :- {order.date}</h2>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(order).map((item, index) => (
                <tr key={index}>
                  {item.title && (
                    <>
                      <td>{item.title}</td>
                      <td>₹ {item.price}</td>
                      <td>{item.qty} </td>
                      <td>₹ {(item.price * item.qty).toFixed(2)}</td>
                    </>
                  )}
                </tr>
              ))}
              <tr>
                <td colSpan={4}>
                  Total Price :- &nbsp;₹ &nbsp;
                  {Object.values(order)
                    .reduce(
                      (total, item) =>
                        item.title ? item.price * item.qty + total : total,
                      0
                    )
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
