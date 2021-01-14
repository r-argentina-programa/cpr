import { ProductsProvider } from "./products";
import { BrandsProvider } from "./brands";

export default function Providers({ children }) {
  return (
    <BrandsProvider>
      <ProductsProvider>{children}</ProductsProvider>
    </BrandsProvider>
  );
}
