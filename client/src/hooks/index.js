import { ProductsProvider } from "./products";

export default function Providers({ children }) {
  return <ProductsProvider>{children}</ProductsProvider>;
}
