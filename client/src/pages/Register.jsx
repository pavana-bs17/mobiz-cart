import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    firstname: "",
    surname: "",
    username: "",
    email: "",
    address: "",
    password: "",
    confirm_password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://localhost:8000/api/user/register",
        { ...inputs },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);

        if (!res.data.created) {
          if (res.data.error_type == 0) {
            toast.error(res.data.error[0].msg, {
              position: "bottom-right",
            });
          } else if (res.data.error_type == 1) {
            toast.error(res.data.message, {
              position: "bottom-right",
            });
          }
        }

        if (res.data.created) {
          toast.success(res.data.message, {
            position: "top-right",
          });

          setTimeout(() => {
            navigate("/");
          }, 5000);
        }
      })
      .catch((err) => {
        console.log(`Request error: ${err}`);
      });
  };
  return (
    <div className="w-full flex justify-center items-center">
      <form
        className="bg-white p-4 shadow-md border rounded my-5 py-3"
        onSubmit={submitHandler}
      >
        <h2 className="text-center w-full p-3 text-gray-500 text-xl font-bold">
          Register Account
        </h2>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold">Firstname</label>
          <input
            type="text"
            placeholder="firstname"
            id="firstname"
            name="firstname"
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md border border-gray-500 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold">Surname</label>
          <input
            type="text"
            placeholder="Surname"
            id="surname"
            name="surname"
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md border border-gray-500 rounded"
          />
        </div>
        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold">Username</label>
          <input
            type="text"
            placeholder="username"
            id="username"
            name="username"
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md border border-gray-500 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold">Email</label>
          <input
            type="text"
            placeholder="Email"
            id="email"
            name="email"
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md border border-gray-500 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold">Address</label>
          <input
            type="address"
            placeholder="address"
            id="address"
            name="address"
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md  border border-gray-500 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold">Password</label>
          <input
            type="password"
            placeholder="password"
            id="password"
            name="password"
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md  border border-gray-500 rounded"
          />
        </div>

        <div className="mb-2">
          <label
            className="text-gray-500 mb-2 font-bold"
            htmlFor="confirm_password"
          >
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            id="confirm_password"
            name="confirm_password"
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md  border border-gray-500 rounded"
          />
        </div>

        <div className="flex flex-col justify-between items-center my-3 mb-5">
          <button className="text-white font-bold bg-blue-500 py-2 px-3 border rounder hover:bg-blue-700">
            Register
          </button>
          <Link to="/login" className="text-blue-500">
            <p>Already have an account? Login In</p>
          </Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
