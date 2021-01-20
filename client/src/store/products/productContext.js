import React, { createContext, useReducer } from "react";

import api from "../../services/api";

import productReducer from "./productReducer";

import { GET_ALL_PRODUCTS } from "./productTypes";

export const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  const initialState = [];

  const [state, dispatch] = useReducer(productReducer, initialState);

  const getAllProducts = async () => {
    try {
      const res = await api.get("/api/products/all");
      if (res.status === 200) {
        dispatch({ type: GET_ALL_PRODUCTS });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ProductContext.Provider value={{ getAllProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
