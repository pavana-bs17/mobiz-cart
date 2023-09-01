const initialState = {
    cart: [],
    total: 0,
  };
  
  const cartReducer = (state = initialState, action) => {
    switch (action.type) {
       
          case "SET_TOTAL":
            return {
              ...state,
              total : action.payload ,
            }
    
        case "UPDATE_CART_ITEMS":
          return {
            ...state,
            cart: action.payload,
          }  
    
        default:
          return state;
      }
  }
  export default cartReducer;