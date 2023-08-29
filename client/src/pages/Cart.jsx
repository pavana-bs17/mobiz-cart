import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setTotal, updateCartItems } from "../redux/actions/index";

const Cart = () => {
  const userid = useSelector((state) => state.user.userid);
  const cart = useSelector((state) => state.cart.cart);
  const userDetails = useSelector((state) => state.user.userDetails);

  const navigate = useNavigate();
  const token = Cookie.get("jwt_token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (userid !== null) {
      fetchCartItems();
      setIsLoading(false);
    }
  }, [userid]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  isConfirmationModalOpen &&
    setTimeout(() => setIsConfirmationModalOpen(false), 4000);

  const handleConfirmOrder = () => {
    const updatedItems = cart.map((item) => ({
      itemId: item.product._id,
      quantity: item.product.quantity - item.quantity,
    }));

    axios
      .put(`http://localhost:8000/api/items/update_multiple_cart_items`, {
        items: updatedItems,
      })
      .then((response) => {

        if (response.data.status === 0) {
          toast.error(response.data.error[0].msg, {
            position: "bottom-right",
          });
        }

        if (response.data.status === 1) {
          toast.success(response.data.message, {
            position: "top-right",
          });
        }

        //items' quantities are updated, remove items from cart
        const cartItemIdsToRemove = cart.map((item) => item._id);
        axios
          .delete(`http://localhost:8000/api/cart/remove_multiple_from_cart`, {
            data: {
              cart_item_ids: cartItemIdsToRemove,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setIsModalOpen(false);
            setIsConfirmationModalOpen(true);
            fetchCartItems();
            navigate("/");
          })
          .catch((removeError) => {
            console.error("Error removing items from cart:", removeError);
          });
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  const fetchCartItems = () => {
    axios
      .get(`http://localhost:8000/api/cart/get_cart_items/${userid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch(updateCartItems(response.data));
        const cartItems = response.data;
        let total = 0;

        for (const cartItem of cartItems) {
          total += cartItem.quantity;
        }

        dispatch(setTotal(total));
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  };

  const updateCartItemQuantity = (productName, cartItemId, quantity) => {
    if (quantity == 0) {
      axios
        .delete(
          `http://localhost:8000/api/cart/remove_from_cart/${cartItemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          fetchCartItems();
        })
        .catch((error) => {
          console.error("Error removing cart item:", error);
        });
    } else {
      axios
        .put(
          `http://localhost:8000/api/cart/update_cart_item/${cartItemId}`,
          {
            quantity: quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          toast.success(`${productName} quantity updated successfully!`, {
            position: toast.POSITION.TOP_RIGHT,
          });
          fetchCartItems();
        })
        .catch((error) => {
          console.error("Error updating cart item quantity:", error);
        });
    }
  };

  const removeFromCart = (cartItemId) => {
    axios
      .delete(`http://localhost:8000/api/cart/remove_from_cart/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchCartItems();
        if (response.data.status === 1) {
          toast.success(response.data.message, {
            position: "top-right",
          });
        }
      })
      .catch((error) => {
        console.error("Error removing cart item:", error);
      });
  };

  // Function to check item quantities and display toast for out-of-stock items
  const Checkout = (cart) => {
    const itemIds = cart.map((item) => item.product._id);

    axios
      .post("http://localhost:8000/api/items/all_items", { itemIds })
      .then((response) => {
        const updatedItemQuantities = response.data;

        // Check if any of the items in the cart have a quantity of 0
        const outOfStockItems = cart.filter(
          (item) => updatedItemQuantities[item.product._id] == 0
        );

        if (outOfStockItems.length > 0) {
          const outOfStockItemNames = outOfStockItems
            .map((item) => item.product.name)
            .join(", ");
          // Display toast message for out of stock items
          toast.error(
            `${outOfStockItemNames} out of stock. Please remove them from your cart.`,
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        } else {
          setIsModalOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching item quantities:", error);
      });
  };
  return (
    <div className="w-full md:min-h-full flex justify-center">
      {isLoading ? (
        <div className="text-center my-4">Loading...</div>
      ) : (
        <div className="w-[95%] mt-[20px] md:mt-[90px] flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-[70%] mb-4 md:mb-0 md:mr-4 overflow-x-auto md:overflow-hidden">
            <div className="w-full md:h-[550px]  h-80 custom-scrollbar overflow-y-scroll">
              <table className="w-full border-collapse border border-slate-400">
                <tbody>
                  <tr className="bg-slate-300">
                    <th className="border border-slate-700 p-3">Name</th>
                    <th className="border border-slate-700 p-3">Price</th>
                    <th className="border border-slate-700 p-3">Image</th>
                    <th className="border border-slate-700 p-3">Quantity</th>
                    <th className="border border-slate-700 p-3">Total</th>
                    <th className="border border-slate-700 p-3">Action</th>
                  </tr>
                  {cart.map((item) => {
                      const product = item?.product;
                      return (
                        <tr key={item._id} className="hover:bg-slate-100">
                          <td className="border border-slate-300 text-center">
                            {product?.name}
                          </td>
                          <td className="border border-slate-300 text-center">
                            Rs. {product?.price?.toFixed(2)}
                          </td>
                          <td className="border border-slate-300 text-center">
                            <img
                              src={product?.image}
                              className="w-20 h-20"
                              alt={product.name}
                            />
                          </td>
                          <td className="border border-slate-300 text-center">
                            <button
                              onClick={() =>
                                updateCartItemQuantity(
                                  product?.name,
                                  item._id,
                                  Math.max(item.quantity - 1, 0)
                                )
                              }
                              className="py-1 px-2 focus:border border-orange-300 mx-2 font-bold text-2xl"
                              disabled={item.quantity <= 0}
                            >
                              -
                            </button>
                            {item?.quantity}
                            <button
                              onClick={() => {
                                if (item.quantity < item.product.quantity) {
                                  updateCartItemQuantity(
                                    product?.name,
                                    item._id,
                                    item.quantity + 1
                                  );
                                }
                              }}
                              className="py-1 px-2 focus:border border-orange-300 mx-2 font-bold text-2xl"
                              disabled={item.quantity >= item.product.quantity}
                            >
                              +
                            </button>
                          </td>
                          <td className="border border-slate-300 text-center">
                            Rs. {(product.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="border border-slate-300 text-center">
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="py-1 px-2 rounded bg-red-500 text-white"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  {cart?.length == 0 && ( 
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center font-bold text-3xl"
                      >
                        No Item Selected
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full h-80 md:w-[25%] shadow py-3 px-2 flex justify-center">
            <div className="w-[95%]">
              <h3 className="text-3xl font-bold text-gray-600 text-center my-4 w-full border border-b-slate-200">
                Cart Info
              </h3>
              <h4 className="text-bold border border-b-slate-200 border-l-0 border-t-0 border-r-0 py-2">
                Total Items: {cart.filter((item) => item.quantity > 0).length}
              </h4>
              <h4 className="text-bold text-bold border border-b-slate-200 border-l-0 border-t-0 border-r-0 py-2">
                Total Quantity:{" "}
                {cart.reduce((sum, items) => (sum += items.quantity), 0)}
              </h4>
              <h4 className="text-bold text-bold border border-b-slate-200 border-l-0 border-t-0 border-r-0 py-2">
                Total Price: Rs.{" "}
                {cart
                  .reduce(
                    (sum, items) =>
                      (sum += items.product.price * items.quantity),
                    0
                  )
                  .toFixed(2)}
              </h4>

              <button
                onClick={() => {
                  cart.length > 0 && Checkout(cart);
                }}
                className="bg-orange-400 rounded px-3 py-2 text-white w-full my-4"
              >
                CheckOut
              </button>

              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
                  <div className="bg-white rounded z-10 mx-auto p-6 w-full md:w-[50%] lg:w-[40%] xl:w-[30%]">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl md:text-2xl font-bold mx-auto">
                          Checkout Page Details
                        </h2>
                        <AiOutlineClose
                          onClick={() => setIsModalOpen(false)}
                          className="text-black text-4xl px-2"
                        />
                      </div>
                      <div className="h-96 overflow-y-scroll custom-scrollbar">
                        <div className="mb-4">
                          <div className="flex flex-col justify-center items-start mb-4">
                            <h3 className="text-lg font-semibold mb-2">
                              User Information
                            </h3>
                            <p className="text-start">
                              <span className="font-bold">Name:</span>{" "}
                              {userDetails.username}
                            </p>
                            <p className="text-start whitespace-normal">
                              <span className="font-bold">Address:</span>{" "}
                              {userDetails.address}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-col justify-center items-start mb-4">
                            <h3 className="text-lg font-semibold mb-2">
                              Product Information
                            </h3>
                            {cart.map((item) => {
                              const product = item.product;
                              return (
                                <div key={item._id} className="text-start mb-3">
                                  <p>
                                    <span className="font-bold">Product:</span>{" "}
                                    {product.name}
                                  </p>
                                  <p>
                                    <span className="font-bold">Quantity:</span>{" "}
                                    {item.quantity}
                                  </p>
                                  <p>
                                    <span className="font-bold">Price:</span> Rs.
                                    {(product.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              );
                            })}
                            <p className="text-center mb-4 text-md">
                              <span className="font-bold ">
                                Total Quantity:
                              </span>
                              {cart.reduce(
                                (sum, items) => (sum += items.quantity),
                                0
                              )}
                            </p>
                            <p className="text-center mb-4 text-xl">
                              <span className="font-bold">Total Price:</span> Rs.
                              {cart
                                .reduce(
                                  (sum, items) =>
                                    (sum +=
                                      items.product.price * items.quantity),
                                  0
                                )
                                .toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-col justify-center items-start">
                            <p className="text-center mb-4 text-md">
                              <span className="font-bold">
                                Estimated delivery:
                              </span>
                              5-7 days.
                            </p>

                            <h3 className="text-lg font-semibold mb-2">
                              Payment method
                            </h3>
                            <p>COD</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setIsModalOpen(false);
                            setIsConfirmationModalOpen(true);
                            handleConfirmOrder();
                          }}
                          className="bg-orange-400 text-white px-4 py-2 rounded mt-4"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
          <div className="bg-white rounded z-10 mx-auto p-6 w-full md:w-[50%] lg:w-[40%] xl:w-[30%]">
            <img
              src={`data:image/png;base64,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`}
              alt="Order Placed Successfully"
              className="mx-auto mb-4 w-20 h-20"
            />
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
              Order Placed Successfully
            </h2>

            <p className="text-center">
              Your order will be shipped within 7 days. Thank you for shopping!
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  // setIsModalOpen(false);
                  setIsConfirmationModalOpen(false);
                }}
                className="bg-orange-400 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Cart;
