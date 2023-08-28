import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTotal, updateCartItems, setUserId } from "../redux/actions/index";
import Cookie from "js-cookie";

const ProductDetails = () => {
  const params = useParams();
  const productid = params.productid;
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  const token = Cookie.get("jwt_token");
  const dispatch = useDispatch();
  const LoginStatus = useSelector((state) => state.user.IsLoggIn);
  const userid = useSelector((state) => state.user.userid);
  const isadmin = useSelector((state) => state.user.isadmin);

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  const updateProductHandler = () => {
    navigate("/updateproduct", { state: { product } });
  };

  useEffect(() => {
    axios({
      url: `http://localhost:8000/api/items/get_item/${productid}`,
      method: "get",
    })
      .then((res) => {
        if (res.data.status == 0) {
          setError(true);
        }

        setProduct(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productid]);

  const fetchCartItems = () => {
    axios
      .get(`http://localhost:8000/api/cart/get_cart_items/${userid}`)
      .then((response) => {
        const cartItems = response.data;
        let total = 0;

        for (const cartItem of cartItems) {
          total += cartItem.quantity;
        }

        dispatch(setTotal(total));
        dispatch(updateCartItems(response.data));
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  };

  useEffect(() => {
    fetchCartItems();
  }, [userid]);

  const addToCartHandler = async (productId) => {
    const newItem = {
      user_id: userid,
      product_id: productId,
      quantity: 1,
    };

    try {
      await axios
        .post("http://localhost:8000/api/cart/add_to_cart", newItem, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          fetchCartItems();
          fetchCartItems();
          dispatch(setUserId(userid));

          if (res.data.status === 1) {
            toast.success(res.data.message, {
              position: "top-right",
            });
          }
        })
        .catch((err) => {
          console.log(`Error adding items to cart error: ${err}`);

          if (err.response && err.response.data && err.response.data.message) {
            toast.error(err.response.data.message, {
              position: "bottom-right",
            });
          } else {
            toast.error("An error occurred while adding items to cart", {
              position: "bottom-right",
            });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-100 mt-5 flex justify-center">
      {error && (
        <div className="text-center">
          <h2 className="text-red-500 mb-2">Product Not Found</h2>
          <p>
            The product you're looking for does not exist or has been removed.
          </p>
          <Link to="/" className="text-blue-500">
            Back to Home
          </Link>
        </div>
      )}
      {product && !error && (
        <div className="w-full h-72 mt-5 flex justify-center">
          <div className="w-[80%] mt-[90px] grid gap-4 grid-cols-2">
            <div>
              <img src={product.image} className="w-80%" />
            </div>
            <div className="grid gap-4">
              <div>
                <h2>
                  <strong>Name: </strong>
                  {product.name}
                </h2>
                <h3 className="my-2">
                  <strong>Price: </strong>Rs {product.price}
                </h3>
                <p className="text-justify mb-5">
                  <strong>Description:</strong>{" "}
                  {showFullDescription
                    ? product.description
                    : product.description.slice(0, 150)}
                  {product.description.length > 150 && (
                    <span
                      className="text-blue-500 cursor-pointer hover:underline"
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                    >
                      {showFullDescription ? "See Less" : "See More"}
                    </span>
                  )}
                </p>
                <div>
                  {isadmin && (
                    <>
                      <button
                        id={productid}
                        onClick={updateProductHandler}
                        className="mt-5 block py-2 px-5 bg-orange-400 text-white rounded hover:bg-orange-200 hover:text-black"
                      >
                        Update
                      </button>
                    </>
                  )}
                  {!isadmin && LoginStatus && (
                    <button
                      id={product._id}
                      onClick={() => addToCartHandler(product._id)}
                      className="block py-2 px-5 bg-orange-400 text-white rounded hover:bg-orange-200 hover:text-black"
                    >
                      Add To Cart
                    </button>
                  )}
                  {!isadmin && !LoginStatus && (
                    <Link to={`/login`}>
                      <button className="block py-2 px-5 bg-orange-400 text-white rounded hover:bg-orange-200 hover:text-black">
                        Add to Cart
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};
export default ProductDetails;
