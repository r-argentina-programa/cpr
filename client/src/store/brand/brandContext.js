import React, { createContext, useReducer } from 'react';

import api from '../../services/api';

import productReducer from './brandReducer';

import { GET_ALL_BRANDS, GET_BRAND_ID, GET_BRANDS_ERROR, BRANDS_LOADING } from './brandTypes';

export const BrandContext = createContext();

const BrandContextProvider = ({ children }) => {
  const initialState = {
    brands: [],
    brand: {},
    error: false,
    loading: true,
  };

  const [state, dispatch] = useReducer(productReducer, initialState);

  const getAllBrands = async () => {
    dispatch({ type: BRANDS_LOADING });
    try {
      const res = await api.get('/api/brands/all');
      if (res.status === 200) {
        dispatch({ type: GET_ALL_BRANDS, payload: res.data });
      }
    } catch (error) {
      dispatch({ type: GET_BRANDS_ERROR, payload: error.response.data.error });
    }
  };

  const getBrandById = async (id) => {
    dispatch({ type: BRANDS_LOADING });
    try {
      const res = await api.get(`/api/brand/${id}`);
      dispatch({ type: GET_BRAND_ID, payload: res.data });
    } catch (error) {
      dispatch({ type: GET_BRANDS_ERROR, payload: error.response.data.error });
    }
  };

  return (
    <BrandContext.Provider
      value={{
        brands: state.brands,
        brand: state.brand,
        error: state.error,
        loading: state.loading,
        getAllBrands,
        getBrandById,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export default BrandContextProvider;
