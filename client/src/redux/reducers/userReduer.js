const initialState = {
  IsLoggIn: false,
  isadmin: false,
  userid: null, // Add user_id field
  userDetails: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ISLOGGED_IN":
      return {
        ...state,
        IsLoggIn: action.payload,
      };

    case "SET_USER_DETAILS":
      return {
        ...state,
        userDetails: action.payload, // Set user details
      };

    case "SET_ISADMIN":
      return {
        ...state,
        isadmin: action.payload,
      };

    case "SET_USERID": // Add action to set user_id
      return {
        ...state,
        userid: action.payload,
      };

    default:
      return state;
  }
};
export default userReducer;