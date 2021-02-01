import { GET_ALL_CATEGORIES, GET_CATEGORIES_ERROR, GET_RELATED_PRODUCTS } from './categoryTypes';

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_CATEGORIES:
      return {
        ...state,
        categories: [...action.payload],
        error: false,
      };
    case GET_CATEGORIES_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case GET_RELATED_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        error: false,
      };
    default:
      return state;
  }
}
