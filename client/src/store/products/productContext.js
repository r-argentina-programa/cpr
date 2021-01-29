/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import React, { createContext, useReducer } from 'react';

import api from '../../services/api';

import productReducer from './productReducer';

import {
  GET_ALL_PRODUCTS,
  GET_PRODUCT_DETAILS,
  PRODUCTS_BY_BRAND,
  PRODUCTS_BY_CATEGORY,
  GET_PRODUCT_SEARCH,
  GET_PRODUCTS_FILTERED,
  GET_CART_DATA,
  GET_PRODUCTS_ERROR,
  PRODUCT_SEARCH_ERROR,
  PRODUCTS_LOAD,
} from './productTypes';

export const ProductContext = createContext();

const ProductContextProvider = ({ children }) => {
  const initialState = {
    products: [],
    product: {},
    search: [],
    cartData: {},
    error: false,
    loading: true,
  };

  const [state, dispatch] = useReducer(productReducer, initialState);

  const getAllProducts = async () => {
    try {
      dispatch({ type: PRODUCTS_LOAD });
      const res = await api.get('/api/products/all/5/5');
      if (res.status === 200) {
        dispatch({ type: GET_ALL_PRODUCTS, payload: res.data });
      }
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR, payload: error.response.data.error });
    }
  };

  const getProductDetails = async (id) => {
    try {
      dispatch({ type: PRODUCTS_LOAD });
      const res = await api.get(`api/product/${id}`);
      if (res.status === 200) {
        dispatch({ type: GET_PRODUCT_DETAILS, payload: res.data });
      }
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR, payload: error.response.data.error });
    }
  };

  const getProductsByBrand = async (brandId) => {
    try {
      dispatch({ type: PRODUCTS_LOAD });
      const res = await api.get(`/api/brand/${brandId}/viewProducts`);
      if (res.status === 200) {
        dispatch({ type: PRODUCTS_BY_BRAND, payload: res.data });
      }
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR, payload: error.response.data.error });
    }
  };

  const getProductsByCategory = async (categoryId) => {
    try {
      dispatch({ type: PRODUCTS_LOAD });
      const res = await api.get(`/api/category/${categoryId}/viewProducts`);
      if (res.status === 200) {
        dispatch({ type: PRODUCTS_BY_CATEGORY, payload: res.data });
      }
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR, payload: error.response.data.error });
    }
  };

  const getProductBySearch = async (term) => {
    dispatch({ type: PRODUCTS_LOAD });
    try {
      const res = await api.get(`/api/search/${term}`);
      if (res.status === 200) {
        if (res.data.length === 0) {
          dispatch({
            type: PRODUCT_SEARCH_ERROR,
            payload: "We couldn't find any results for this term",
          });
        } else {
          dispatch({ type: GET_PRODUCT_SEARCH, payload: res.data });
        }
      }
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR, payload: error.response.data.error });
    }
  };

  const getFilteredProducts = async (brands, categories, price, page, search) => {
    try {
      dispatch({ type: PRODUCTS_LOAD });
      if (brands.length === 0) {
        brands = '0';
      }
      if (categories.length === 0) {
        categories = '0';
      }
      if (!search) {
        search = '0';
      }
      if (!page) {
        page = 1;
      }
      if (!price) {
        price = '0-0';
      }

      const res = await api.get(
        `/api/products/all/${brands}/${categories}/${price}/${page}/${search}`
      );
      dispatch({ type: GET_PRODUCTS_FILTERED, payload: res.data });
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR, payload: error.response.data.error });
    }
  };

  const getCartFinalDiscounts = async (productsId, productsAmount) => {
    try {
      dispatch({ type: PRODUCTS_LOAD });
      const res = await api.get(`/api/getCartPrice/${productsId}/${productsAmount}`);
      dispatch({ type: GET_CART_DATA, payload: res.data });
    } catch (error) {
      dispatch({ type: GET_PRODUCTS_ERROR, payload: error.response.data.error });
    }
  };
  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        product: state.product,
        search: state.search,
        cartData: state.cartData,
        error: state.error,
        loading: state.loading,
        getAllProducts,
        getProductDetails,
        getProductsByBrand,
        getProductsByCategory,
        getProductBySearch,
        getFilteredProducts,
        getCartFinalDiscounts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
