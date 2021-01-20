import ProductContextProvider from "./products/productContext";
import BrandContextProvider from "./brand/brandContext";

export default function Providers({ children }) {
  return (
    <BrandContextProvider>
      <ProductContextProvider>{children}</ProductContextProvider>;
    </BrandContextProvider>
  );
}
