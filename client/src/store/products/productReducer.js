import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_DETAILS,
  PRODUCTS_BY_BRAND,
  PRODUCTS_BY_CATEGORY,
  GET_PRODUCT_SEARCH,
} from "./productTypes";

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
    case PRODUCTS_BY_BRAND:
    case PRODUCTS_BY_CATEGORY:
      return {
        ...state,
        products: [...action.payload],
      };
    case GET_PRODUCT_DETAILS:
      return {
        ...state,
        product: { ...action.payload },
      };
    case GET_PRODUCT_SEARCH:
      return {
        ...state,
        search: [...action.payload],
      };
    default:
      return state;
  }
}
