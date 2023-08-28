import React from "react";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import Cookie from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { setIsAdmin, IsLoggedIn } from "../redux/actions/index";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const dispatch = useDispatch();

  const LoginStatus = useSelector((state) => state.user.IsLoggIn);
  const isadmin = useSelector((state) => state.user.isadmin);
  const total = useSelector((state) => state.cart.total);

  const closeNav = () => {
    setNav(false);
  };

  const navHandler = () => {
    setNav(!nav);
  };

  const logoutHandler = () => {
    Cookie.remove("jwt_token");
    dispatch(IsLoggedIn(false));
    dispatch(setIsAdmin(false));
  };

  return (
    <div className="w-full h-25 bg-[#00295b] flex justify-between items-center">
      <Link to="/">
        <h1 className="text-white font-bold md:text-4xl sm:3xl text-xl p-3">
          MOBIz
        </h1>
      </Link>
      <ul className="hidden md:flex p-3">
        <Link to="/">
          <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
            Home
          </li>
        </Link>
        {LoginStatus && isadmin && (
          <>
            <Link to="/addnewproduct">
              <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                Add New Product
              </li>
            </Link>
          </>
        )}

        {LoginStatus && !isadmin && (
          <Link to="cart">
            <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
              Cart{" "}
              <span className="px-1 py-0.4 bg-orange-400 rounded-full ">
                {total || 0}
              </span>
            </li>
          </Link>
        )}
        {LoginStatus ? (
          <>
            <Link to="/">
              <li
                onClick={logoutHandler}
                className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer"
              >
                Logout
              </li>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                Login
              </li>
            </Link>
            <Link to="/register">
              <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                Register
              </li>
            </Link>
          </>
        )}
      </ul>

      <div className="md:hidden">
        {nav ? (
          <AiOutlineClose
            onClick={navHandler}
            className="text-white text-4xl px-2"
          />
        ) : (
          <AiOutlineMenu
            onClick={navHandler}
            className="text-white text-4xl px-2 "
          />
        )}
      </div>

      <div
        className={
          nav
            ? `md:hidden fixed top-0 left-0 h-[100%] w-60 bg-[#007aa6] ease-in-out duration-300 z-50`
            : `hidden `
        }
      >
        <Link to="/">
          <h1 className="text-white text-left font-bold md:text-4xl sm:3xl text-xl p-3">
            MOBIz
          </h1>
        </Link>
        <ul className=" flex flex-col text-left p-3">
          <Link to="/" onClick={closeNav}>
            {" "}
            <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
              Home
            </li>
          </Link>

          {LoginStatus ? (
            <>
              {/* <Link to="/">
                <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                  Profile
                </li>
              </Link> */}
              {isadmin ? (
                <Link to="addnewproduct" onClick={closeNav}>
                  <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                    Add New Product
                  </li>
                </Link>
              ) : (
                <Link to="/cart" onClick={closeNav}>
                  <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                    Cart{" "}
                    <span className="px-1 py-0.4 bg-orange-400 rounded-full ">
                      {total || 0}
                    </span>
                  </li>
                </Link>
              )}

              <Link to="/" onClick={closeNav}>
                <li
                  onClick={logoutHandler}
                  className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer"
                >
                  Logout
                </li>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeNav}>
                <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                  Login
                </li>
              </Link>
              <Link to="register" onClick={closeNav}>
                <li className="text-white font-bold p-2 hover:bg-[#2C2A2A] cursor-pointer">
                  Register
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
