import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_DETAILS,
  PRODUCTS_BY_BRAND,
  PRODUCTS_BY_CATEGORY,
  GET_PRODUCT_SEARCH,
  GET_PRODUCTS_FILTERED,
  GET_PRODUCTS_ERROR,
  GET_NUMBER_OF_PRODUCTS_ERROR,
  GET_NUMBER_OF_PRODUCTS,
  GET_CART_DATA,
  PRODUCT_SEARCH_ERROR,
  PRODUCTS_LOAD,
} from './productTypes';

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_PRODUCTS:
    case GET_PRODUCTS_FILTERED:
    case PRODUCTS_BY_BRAND:
    case PRODUCTS_BY_CATEGORY:
      return {
        ...state,
        products: [...action.payload],
        error: false,
        loading: false,
      };
    case GET_PRODUCT_DETAILS:
      return {
        ...state,
        product: { ...action.payload },
        error: false,
        loading: false,
      };
    case GET_CART_DATA:
      return {
        ...state,
        cartData: action.payload,
        error: false,
        loading: false,
      };
    case GET_PRODUCTS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case GET_NUMBER_OF_PRODUCTS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case GET_NUMBER_OF_PRODUCTS:
      return {
        ...state,
        numberOfProducts: action.payload,
        error: false,
        loading: false,
      };
    case GET_PRODUCT_SEARCH:
      return {
        ...state,
        search: action.payload,
        error: false,
        loading: false,
        searchError: false,
      };
    case PRODUCT_SEARCH_ERROR:
      return {
        ...state,
        error: action.payload,
        search: [],
        loading: false,
        searchError: true,
      };
    case PRODUCTS_LOAD:
      return {
        ...state,
        loading: true,
        products: [],
      };
    default:
      return state;
  }
}
