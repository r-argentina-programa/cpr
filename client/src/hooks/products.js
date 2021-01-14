import { createContext, useContext, useState } from "react";
import api from "../services/api";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);

  async function getAllProducts() {
    try {
      const res = await api.get("/brands/all");
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        setProducts,
        products,
        getAllProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider  ");
  }
  return context;
}
