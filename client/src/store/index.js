import ProductContextProvider from "./products/productContext";

export default function Providers({ children }) {
  return <ProductContextProvider>{children}</ProductContextProvider>;
}
