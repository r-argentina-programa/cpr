import React, { createContext, useReducer } from 'react';

import api from '../../services/api';

import categoryReducer from './categoryReducer';

import { GET_ALL_CATEGORIES } from './categoryTypes';

export const CategoryContext = createContext();

const CategoryContextProvider = ({ children }) => {
  const initialState = {
    categories: [],
  };

  const [state, dispatch] = useReducer(categoryReducer, initialState);

  const getAllCategories = async () => {
    try {
      const res = await api.get('/api/categories/all');
      if (res.status === 200) {
        dispatch({ type: GET_ALL_CATEGORIES, payload: res.data });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <CategoryContext.Provider value={{ getAllCategories, categories: state.categories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContextProvider;
