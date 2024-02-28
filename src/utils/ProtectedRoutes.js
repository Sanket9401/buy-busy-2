import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { authSelector } from "../redux/reducers/authReducer";

export default function ProtectedRoutes({ children }) {
  const { user } = useSelector(authSelector);
  // console.log(user, "from protected");
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      return navigate("/sign-in");
    }
  }, [user, navigate]);

  return children;
}
