// actions.js
import { IsLoggedIn, setUserDetails, setIsAdmin, setUserId } from './userAction';
import { setTotal, updateCartItems } from './cartAction';
import { setProducts } from './itemAction';

// Combine and export all action creators
export {
  IsLoggedIn,
  setUserDetails,
  setIsAdmin,
  setUserId,
  setProducts,
  setTotal,
  updateCartItems,
  // ... add other action creators from different files
};
