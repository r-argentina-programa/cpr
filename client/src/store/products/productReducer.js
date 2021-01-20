import { GET_ALL_PRODUCTS } from "./productTypes";

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return {
        ...state,
        products: [...action.payload],
      };
    default:
      return state;
  }
}
