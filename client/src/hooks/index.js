import { ProductsProvider } from "./products";
import { BrandsProvider } from "./brands";
import { SearchProvider } from "./search";
import { CategoryProvider } from "./categories";

export default function Providers({ children }) {
  return (
    <BrandsProvider>
      <SearchProvider>
        <CategoryProvider>
          <ProductsProvider>{children}</ProductsProvider>
        </CategoryProvider>
      </SearchProvider>
    </BrandsProvider>
  );
}
