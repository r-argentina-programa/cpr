import ProductContextProvider from './products/productContext';
import BrandContextProvider from './brand/brandContext';
import CategoryContextProvider from './category/categoryContext';

export default function Providers({ children }) {
  return (
    <CategoryContextProvider>
      <BrandContextProvider>
        <ProductContextProvider>{children}</ProductContextProvider>
      </BrandContextProvider>
    </CategoryContextProvider>
  );
}
