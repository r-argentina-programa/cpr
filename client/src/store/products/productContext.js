import React, { createContext, useReducer } from "react";

import api from "../../services/api";

import productReducer from "./productReducer";

import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_DETAILS,
  PRODUCTS_BY_BRAND,
} from "./productTypes";

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

  const getProductsByBrand = async (brandId) => {
    try {
      const res = await api.get(`/api/brand/${brandId}/viewProducts`);
      if (res.status === 200) {
        dispatch({ type: PRODUCTS_BY_BRAND, payload: res.data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        getAllProducts,
        products: state.products,
        getProductDetails,
        product: state.product,
        getProductsByBrand,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
