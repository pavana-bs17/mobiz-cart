export const setProducts = (data) => (dispatch) => {
    dispatch({
      type: "SET_PRODUCTS",
      payload: data,
    });
  };

//   export const setProducts = (data) => (dispatch) => {
//     dispatch({
//       type: "SET_PRODUCTS",
//       payload: data,
//     });
//   };
  //   import { createAction } from '@reduxjs/toolkit';
  
  // export const setProducts = createAction('SET_PRODUCTS');
  