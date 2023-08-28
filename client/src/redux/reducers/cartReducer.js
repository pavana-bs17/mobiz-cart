const initialState = {
    cart: []
  };
  
  const cartReducer = (state = initialState, action) => {
    switch (action.type) {
       
          case "SET_TOTAL":
            return {
              ...state,
              total : action.payload ,
            }
    
        case "SET_PRODUCTS":
          return {
            ...state,
            products: action.payload,
          };
    
        case "ADD_PRODUCT":
          return {
            ...state,
            products: [...state.products, action.payload.product],
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
  export default cartReducer;