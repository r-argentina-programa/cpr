import { GET_ALL_CATEGORIES } from "./categoryTypes";

export default function productReducer(state, action) {
  switch (action.type) {
    case GET_ALL_CATEGORIES:
      return {
        ...state,
        categories: [...action.payload],
      };
    default:
      return state;
  }
}
