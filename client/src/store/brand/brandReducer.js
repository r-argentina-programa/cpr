import { GET_ALL_BRANDS, GET_BRAND_ID } from "./brandTypes";

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_BRANDS:
      return {
        ...state,
        brands: [...action.payload],
      };
    case GET_BRAND_ID:
      return {
        ...state,
        brand: { ...action.payload },
      };
    default:
      return state;
  }
}
