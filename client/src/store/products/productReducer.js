import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_DETAILS,
  PRODUCTS_BY_BRAND,
} from "./productTypes";

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
    case PRODUCTS_BY_BRAND:
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
