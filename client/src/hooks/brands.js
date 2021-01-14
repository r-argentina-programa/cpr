import { createContext, useContext, useState } from "react";
import api from "../services/api";

const BrandContext = createContext();

export function BrandsProvider({ children }) {
  const [brands, setBrands] = useState([]);

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

  return (
    <BrandContext.Provider
      value={{
        setBrands,
        brands,
        getAllBrands,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function UseBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("UseBrand must be used within a BrandProvider  ");
  }
  return context;
}
