import React, { createContext, useReducer } from "react";

import api from "../../services/api";

import productReducer from "./brandReducer";

import { GET_ALL_BRANDS, GET_BRAND_ID } from "./brandTypes";

export const BrandContext = createContext();

const BrandContextProvider = ({ children }) => {
  const initialState = {
    brands: [],
    brand: {},
  };

  const [state, dispatch] = useReducer(productReducer, initialState);

  const getAllBrands = async () => {
    try {
      const res = await api.get("/api/brands/all");
      if (res.status === 200) {
        dispatch({ type: GET_ALL_BRANDS, payload: res.data });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getBrandById = async (id) => {
    try {
      const res = await api.get(`/api/brand/${id}`);
      dispatch({ type: GET_BRAND_ID, payload: res.data });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <BrandContext.Provider
      value={{
        brands: state.brands,
        brand: state.brand,
        getAllBrands,
        getBrandById,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};

export default BrandContextProvider;
