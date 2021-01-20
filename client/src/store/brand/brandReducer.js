import { GET_ALL_BRANDS } from "./brandTypes";

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_BRANDS:
      return {
        ...state,
        brands: [...action.payload],
      };
    default:
      return state;
  }
}
