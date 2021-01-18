import { createContext, useContext, useState } from "react";
import api from "../services/api";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  async function getAllProducts() {
    try {
      const res = await api.get("api/products/all");
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getProductDetails(id) {
    try {
      setLoading(true);
      const res = await api.get(`api/product/${id}`);
      if (res.status === 200) {
        setProduct(res);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }
  return (
    <ProductsContext.Provider
      value={{
        setProducts,
        products,
        getAllProducts,
        getProductDetails,
        product,
        loading,
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
