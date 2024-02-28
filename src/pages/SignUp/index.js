import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useNavigate } from "react-router-dom";
import Spinner from "./spinner";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, signUpAsync } from "../../redux/reducers/authReducer";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error, isLoading } = useSelector(authSelector);

  useEffect(() => {
    if (user) {
      toast.success("Successfully Signed Up!!!", { autoClose: 500 });
      localStorage.setItem("auth", JSON.stringify(formData));
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong!!!", { autoClose: 500 });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email;
    const password = formData.password;
    dispatch(signUpAsync({ email, password }));
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <input type="text" name="name" placeholder="Enter Name" />
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
      {isLoading ? <Spinner /> : <button type="submit">Sign Up</button>}
    </form>
  );
};
