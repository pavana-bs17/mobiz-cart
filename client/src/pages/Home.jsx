import React, { useEffect, useState } from "react";
// import img1 from "../assests/img1.jpeg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookie from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  setTotal,
  updateCartItems,
  setUserId,
} from "../redux/actions/index";

const Home = () => {
  const [showProduct, setShowProduct] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookie.get("jwt_token");
  const ITEMS_PER_PAGE = 6;
  

  const products = useSelector((state) => state.item.products);
  const isadmin = useSelector((state) => state.user.isadmin);
  const userid = useSelector((state) => state.user.userid);
  const LoginStatus = useSelector((state) => state.user.IsLoggIn);

  const updateProductHandler = (productId) => {
    const selectedProduct = products.find(
      (product) => product._id === productId
    );
    navigate("/updateproduct", { state: { product: selectedProduct } });
  };


  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  useEffect(() => {
    // Fetch data and set showProduct based on the current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setShowProduct(products.slice(startIndex, endIndex));
  }, [products, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setIsLoading(true);
    axios({
      url: "http://localhost:8000/api/items/all_items",
      method: "get",
    })
      .then((res) => {
        dispatch(setProducts(res.data));
        setShowProduct(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error while fetching products", error);
      });
  }, []);

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
      console.error("Error", error);
    }
  };
  const fetchCartItems = () => {
    axios
      .get(`http://localhost:8000/api/cart/get_cart_items/${userid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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

  const deleteProductHandler = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/items/delete/${productId}`
      );

      if (response.data.status === 0) {
        toast.error(response.data.error[0].msg, {
          position: "bottom-right",
        });
      }

      if (response.data.status === 1) {
        const updatedProducts = products.filter(
          (product) => product._id !== productId
        );

        dispatch(setProducts(updatedProducts));
        setShowProduct(updatedProducts);
        toast.success(response.data.message, {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error deleting product. Please try again.", error);
    }
  };

  return (
    <div className="w-full">
      { !isLoading ?( 
      <><div className="w-full h-2/3 flex justify-center mt-5 md:mt-10 mb-4 overflow-y-scroll">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 w-[80%]">
            {showProduct?.map((product) => {
              return (
                <div
                  className="shadow-md bg-white rounded p-4 border"
                  key={product._id}
                >
                  <div className="flex justify-center items-center h-[250px]">
                    <img
                      src={product.image}
                      className="max-h-full max-w-full"
                      alt={product.name} />
                  </div>

                  <div className="w-[95%] flex flex-col justify-between my-3">
                    <div className="mx-2">
                      <h3>Name: {product.name}</h3>
                      <h4>Price: Rs{product.price}</h4>
                      {isadmin && <h4>Qty: {product.quantity}</h4>}
                    </div>
                    <div className="flex justify-between items-center md:mt-2 md:px-1 space-y-1">
                      <div>
                        <Link to={`productdetails/${product._id}`}>
                          <button className="py-2 px-1 hover:text-blue-400 rounded bg-transparent text-orange-400">
                            View Details
                          </button>
                        </Link>
                      </div>
                      <div className="flex space-x-2">
                        {isadmin && (
                          <>
                            <button
                              id={product._id}
                              onClick={() => updateProductHandler(product._id)}
                              className="py-2 px-3 bg-orange-400 text-white rounded hover:bg-orange-200 hover:text-black"
                            >
                              Update
                            </button>
                            <button
                              id={product._id}
                              onClick={() => deleteProductHandler(product._id)}
                              className="py-2 px-3 bg-orange-400 text-white rounded hover:bg-orange-200 hover:text-black"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {!isadmin && LoginStatus && (
                          <button
                            id={product._id}
                            onClick={() => addToCartHandler(product._id)}
                            className="py-2 px-3 bg-orange-400 text-white rounded hover:bg-orange-200 hover:text-black"
                          >
                            Add To Cart
                          </button>
                        )}
                        {!isadmin && !LoginStatus && (
                          <Link to={`/login`}>
                            <button className="bg-orange-400 rounded px-2 py-1 text-white">
                              Add to Cart
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div><div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`py-2 px-3 ${currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed rounded mr-2 text-sm"
                  : "bg-blue-300 text-blue-600 rounded mr-2 text-sm hover:bg-blue-400"}`}
            >
              Prev
            </button>
            {getPageNumbers().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`py-2 px-3 ${currentPage === pageNumber
                    ? "bg-orange-400 text-white rounded mr-2 text-sm"
                    : "bg-gray-300 text-gray-600 rounded mr-2 text-sm hover:bg-gray-400"}`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`py-2 px-3 ${currentPage === totalPages
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed rounded text-sm"
                  : "bg-blue-300 text-blue-600 rounded text-sm hover:bg-blue-400"}`}
            >
              Next
            </button>
          </div></>
      ):(
        <div className="flex justify-center items-center h-96">

        <p>Loading...</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Home;
