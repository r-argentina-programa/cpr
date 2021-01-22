import React, { createContext, useReducer } from 'react';

import api from '../../services/api';

import productReducer from './productReducer';

import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_DETAILS,
  PRODUCTS_BY_BRAND,
  PRODUCTS_BY_CATEGORY,
  GET_PRODUCT_SEARCH,
} from './productTypes';

export const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  const initialState = {
    products: [],
    product: {},
    search: [],
  };

  const [state, dispatch] = useReducer(productReducer, initialState);

  const getAllProducts = async () => {
    try {
      const res = await api.get('/api/products/all');
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
    } catch (error) {
      console.log(error.message);
    }
  };

  const getProductsByBrand = async (brandId) => {
    try {
      const res = await api.get(`/api/brand/${brandId}/viewProducts`);
      if (res.status === 200) {
        dispatch({ type: PRODUCTS_BY_BRAND, payload: res.data });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getProductsByCategory = async (categoryId) => {
    try {
      const res = await api.get(`/api/category/${categoryId}/viewProducts`);
      if (res.status === 200) {
        dispatch({ type: PRODUCTS_BY_CATEGORY, payload: res.data });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getProductBySearch = async (term) => {
    try {
      const res = await api.get(`/api/search/${term}`);
      if (res.status === 200) {
        dispatch({ type: GET_PRODUCT_SEARCH, payload: res.data });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        product: state.product,
        search: state.search,
        getAllProducts,
        getProductDetails,
        getProductsByBrand,
        getProductsByCategory,
        getProductBySearch,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
