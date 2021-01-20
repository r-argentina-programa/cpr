import { GET_ALL_PRODUCTS, GET_PRODUCT_DETAILS } from "./productTypes";

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
      return {
        ...state,
        products: [...action.payload],
      };
    case GET_PRODUCT_DETAILS:
      return {
        ...state,
        product: { ...action.payload },
      };
    default:
      return state;
  }
}
