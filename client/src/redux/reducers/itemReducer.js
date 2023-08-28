const initialState = {
    products: [],
  };

  const itemReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_PRODUCTS":
          return {
            ...state,
            products: action.payload,
          };
    
        case "ADD_PRODUCT":
          return {
            ...state,
            products: action.payload,
          };
    
        case "UPDATE_CART_ITEMS":
          return {
            ...state,
            cart: action.payload,
          }  
    
        default:
          return state;
      }
  }
  export default itemReducer;