import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const AddNewProduct = () => {
  const location = useLocation();
  const { product } = location.state || {};

  useEffect(() => {
    if (product) {
      setinputs({
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        quantity: product.quantity
      });
    }
  }, [product]);

  const [inputs, setinputs] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    quantity: ""
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setinputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(inputs);

    axios({
      url: "http://localhost:8000/api/items/add",
      method: "post",
      data: {
        ...inputs,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.data.status === 0) {
          toast.error(res.data.error[0].msg, {
            position: "bottom-right"
          });
        }

        if (res.data.status === 1) {
          setinputs({
            name: "",
            price: "",
            image: "",
            description: "",
            quantity: "", 
          });
        }

        if (res.data.status === 1) {
          toast.success(res.data.message, {
            position: "top-right"
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="w-full absolute mt-[80px] flex justify-center items-center">
      <form
        className="bg-white p-4 shadow-md border rounded my-5 py-3"
        onSubmit={submitHandler}
      >
        <h2 className="text-center w-full p-3 text-gray-500 text-xl font-bold">
          Add New Product
        </h2>
        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold">
            Product Name
          </label>
          <input
            type="text"
            placeholder="name"
            name="name"
            value={inputs.name}
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md border border-gray-500 rounded"
          />
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold" >
            Product Price
          </label>
          <input
            type="text"
            placeholder="Price"
            value={inputs.price}
            onChange={onChangeHandler}
            name="price"
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md  border border-gray-500 rounded"
            style={{ WebkitAppearance: "none" }}
          />
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold">
            Product Image (Link)
          </label>
          <textarea
            name="image"
            value={inputs.image}
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md  border border-gray-500 rounded"
          ></textarea>
        </div>

        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold">
            Product Description
          </label>
          <textarea
            name="description"
            value={inputs.description}
            onChange={onChangeHandler}
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md  border border-gray-500 rounded"
          ></textarea>
        </div>
        <div className="mb-2">
          <label className="text-gray-500 mb-2 font-bold">
            Quantity
          </label>
          <input
            type="text"
            placeholder="Quantity"
            name="quantity"
            value={inputs.quantity}
            onChange={onChangeHandler}
            min="0"
            className="w-full py-2 px-3 text-gray-500 shadow focus:outline-none focus:shadow-md border border-gray-500 rounded"
          />
        </div>

        <div className="flex justify-center items-center my-3 mb-5">
          <button className="text-white rounded-md font-bold bg-blue-500 py-2 px-3 border rounder hover:bg-blue-700">
            Add New Product
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddNewProduct;
