export const IsLoggedIn = (data) => (dispatch) => {
  dispatch({
    type: "ISLOGGED_IN",
    payload: data,
  });
};

export const setUserDetails = (data) => (dispatch) => {
  dispatch({
    type: "SET_USER_DETAILS",
    payload: data,
  });
};

export const setIsAdmin = (data) => (dispatch) => {
  dispatch({
    type: "SET_ISADMIN",
    payload: data,
  });
};

export const setUserId = (data) => (dispatch) => {
  dispatch({
    type: "SET_USERID",
    payload: data,
  });
};

export const setTotal = (data) => (dispatch) => {
  dispatch({
    type: "SET_TOTAL",
    payload: data,
  });
};

export const setProducts = (data) => (dispatch) => {
  dispatch({
    type: "SET_PRODUCTS",
    payload: data,
  });
};

export const updateCartItems = (data) => (dispatch) => {
  dispatch({ type: "UPDATE_CART_ITEMS", payload: data });
};
