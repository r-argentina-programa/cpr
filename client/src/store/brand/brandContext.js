import React, { createContext, useReducer } from "react";

import api from "../../services/api";

import productReducer from "./brandReducer";

import { GET_ALL_BRANDS } from "./brandTypes";

export const BrandContext = createContext();

const BrandContextProvider = ({ children }) => {
  const initialState = {
    brands: [],
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

  return (
    <BrandContext.Provider value={{ getAllBrands, brands: state.brands }}>
      {children}
    </BrandContext.Provider>
  );
};

export default BrandContextProvider;
