import { useSearch } from "../../hooks/search";

export default function SearchContainer() {
  const { products } = useSearch();
  console.log(products);
  return (
    <>
      {products.length > 0 ? (
        products.map((product) => <p>{product.name}</p>)
      ) : (
        <p>No products found</p>
      )}
    </>
  );
}
