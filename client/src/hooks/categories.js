import { createContext, useContext, useCallback, useState } from "react";
import api from "../services/api";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  async function getAllCategories() {
    try {
      const res = await api.get("api/categories/all");
      if (res.status === 200) {
        setCategories(res.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getProductsFromCategory(id) {
    try {
      const res = await api.get(`api/category/${id}/viewProducts`);
      setDataCategories(res.data);
    } catch (error) {}
  }

  return (
    <CategoryContext.Provider
      value={{
        categories,
        getAllCategories,
        setCategories,
        getProductsFromCategory,
        dataCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("use Auth must be used within a CategoryProvider  ");
  }
  return context;
}
