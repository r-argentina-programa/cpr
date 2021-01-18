import { createContext, useContext, useCallback, useState } from "react";
import api from "../services/api";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSearchData = useCallback(async (term) => {
    try {
      if (term) {
        setLoading(true);
        const res = await api.get(`/api/search/${term}`);
        if (res.status === 200) {
          setProducts(res.data);
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <SearchContext.Provider
      value={{ products, loading, getSearchData, setProducts }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("use Auth must be used within a SearchProvider  ");
  }
  return context;
}
