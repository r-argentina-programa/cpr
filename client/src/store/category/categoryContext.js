import React, { createContext, useReducer } from 'react';

import api from '../../services/api';

import categoryReducer from './categoryReducer';

import { GET_ALL_CATEGORIES, GET_CATEGORIES_ERROR } from './categoryTypes';

export const CategoryContext = createContext();

const CategoryContextProvider = ({ children }) => {
  const initialState = {
    categories: [],
    error: false,
  };

  const [state, dispatch] = useReducer(categoryReducer, initialState);

  const getAllCategories = async () => {
    try {
      const res = await api.get('/api/categories/all');
      if (res.status === 200) {
        dispatch({ type: GET_ALL_CATEGORIES, payload: res.data });
      }
    } catch (error) {
      dispatch({ type: GET_CATEGORIES_ERROR, payload: error.message });
    }
  };

  return (
    <CategoryContext.Provider
      value={{ getAllCategories, categories: state.categories, error: state.error }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContextProvider;
