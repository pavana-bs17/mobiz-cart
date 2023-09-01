export const setProducts = (data) => (dispatch) => {
    dispatch({
      type: "SET_PRODUCTS",
      payload: data,
    });
  };
