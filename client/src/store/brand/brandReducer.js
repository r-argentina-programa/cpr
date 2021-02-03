import { GET_ALL_BRANDS, GET_BRAND_ID, GET_BRANDS_ERROR, BRANDS_LOADING } from './brandTypes';

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_BRANDS:
      return {
        ...state,
        brands: [...action.payload],
        error: false,
        loading: false,
      };
    case GET_BRAND_ID:
      return {
        ...state,
        brand: { ...action.payload },
        error: false,
        loading: false,
      };
    case GET_BRANDS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case BRANDS_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
