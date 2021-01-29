import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_DETAILS,
  PRODUCTS_BY_BRAND,
  PRODUCTS_BY_CATEGORY,
  GET_PRODUCT_SEARCH,
  GET_PRODUCTS_FILTERED,
  GET_PRODUCTS_ERROR,
  GET_CART_DATA,
} from './productTypes';

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
    case GET_PRODUCTS_FILTERED:
    case PRODUCTS_BY_BRAND:
    case PRODUCTS_BY_CATEGORY:
    case GET_PRODUCT_SEARCH:
      return {
        ...state,
        products: [...action.payload],
        error: false,
      };
    case GET_PRODUCT_DETAILS:
      return {
        ...state,
        product: { ...action.payload },
        error: false,
      };
    case GET_CART_DATA:
      return {
        ...state,
        cartData: action.payload,
        error: false,
      };
    case GET_PRODUCTS_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
