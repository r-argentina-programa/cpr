import { ProductsProvider } from "./products";
import { BrandsProvider } from "./brands";
import { SearchProvider } from "./search";

export default function Providers({ children }) {
  return (
    <BrandsProvider>
      <SearchProvider>
        <ProductsProvider>{children}</ProductsProvider>
      </SearchProvider>
    </BrandsProvider>
  );
}
