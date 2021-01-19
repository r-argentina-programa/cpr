import { createContext, useContext, useState } from "react";
import api from "../services/api";

const BrandContext = createContext();

export function BrandsProvider({ children }) {
  const [brands, setBrands] = useState([]);
  const [data, setData] = useState([]);
  async function getAllBrands() {
    try {
      const res = await api.get("api/brands/all");
      if (res.status === 200) {
        setBrands(res.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getProductsFromABrand(id) {
    try {
      const res = await api.get(`/api/brand/${id}/viewProducts`);
      setData(res.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <BrandContext.Provider
      value={{
        setBrands,
        brands,
        getAllBrands,
        getProductsFromABrand,
        data,
        setData,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider  ");
  }
  return context;
}
