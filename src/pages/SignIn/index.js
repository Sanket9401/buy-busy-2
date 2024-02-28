import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelector,
  setError,
  signInAsync,
} from "../../redux/reducers/authReducer";

export const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector(authSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      toast.success("Successfully Signed In!!!", { autoClose: 500 });
      localStorage.setItem("auth", JSON.stringify(formData));
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error("Invalid Credentials!!!", { autoClose: 500 });
      dispatch(setError());
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email;
    const password = formData.password;
    dispatch(signInAsync({ email, password }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        onChange={handleChange}
      />
      {isLoading ? <Spinner /> : <button type="submit">Sign In</button>}
      <p>
        <Link to="/sign-up">Or Sign Up instead</Link>
      </p>
    </form>
  );
};
