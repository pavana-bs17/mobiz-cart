export const updateCartItems = (data) => (dispatch) => {
  dispatch({ type: "UPDATE_CART_ITEMS", payload: data });
};

export const setTotal = (data) => (dispatch) => {
    dispatch({
      type: "SET_TOTAL",
      payload: data,
    })
  }