import Navbar from "./components/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Cookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import axios from "axios";
import AddNewProduct from "./pages/AddNewProduct";
import ProductDetails from "./pages/ProductDetails";
import UpdateProduct from "./pages/UpdateProduct";
import { IsLoggedIn, setIsAdmin, setUserId, setUserDetails } from "./redux/actions/index";

function App() {
  const dispatch = useDispatch();
  const userid = useSelector((state) => state.user.userid);

  const token = Cookie.get("jwt_token");
  const navigate = useNavigate();

   const handleVerification = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/verify_account",
        { token },
        { withCredentials: true }
      );

      dispatch(setUserDetails(res.data));

      if (res.data.isadmin) {
        dispatch(setIsAdmin(true));
      }

      if (!res.data.status) {
        Cookie.remove("jwt_token");
        dispatch(IsLoggedIn(false));
      } else {
        dispatch(setUserId(res.data.userid));
        dispatch(IsLoggedIn(true));
      }
    } catch (err) {
      console.log(`Request err: ${err}`);
    }
  };

  useEffect(() => {
    handleVerification();
  }, [navigate, userid]);


  return (
    <div className="App">
        <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart userid={userid} />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="addnewproduct" element={<AddNewProduct />} />
        <Route path="updateproduct" element={<UpdateProduct />} />
        <Route path="productdetails/:productid" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}

export default App;