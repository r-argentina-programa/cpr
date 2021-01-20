import React, { createContext, useReducer } from "react";

import api from "../../services/api";

import productReducer from "./productReducer";

import { GET_ALL_PRODUCTS, GET_PRODUCT_DETAILS } from "./productTypes";

export const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  const initialState = {
    products: [],
    product: {},
  };

  const [state, dispatch] = useReducer(productReducer, initialState);

  const getAllProducts = async () => {
    try {
      const res = await api.get("/api/products/all");
      if (res.status === 200) {
        dispatch({ type: GET_ALL_PRODUCTS, payload: res.data });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getProductDetails = async (id) => {
    try {
      const res = await api.get(`api/product/${id}`);
      if (res.status === 200) {
        dispatch({ type: GET_PRODUCT_DETAILS, payload: res.data });
      }
    } catch (error) {}
  };

  return (
    <ProductContext.Provider
      value={{
        getAllProducts,
        products: state.products,
        getProductDetails,
        product: state.product,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
