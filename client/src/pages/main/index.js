import { useEffect } from "react";
import Header from "../../components/header";
import { useProducts } from "../../hooks/products";
import styled from "styled-components/macro";
import CardsList from "../../components/productsList";

const ListContainer = styled.div`
  display: flex;
`;

export default function Main() {
  const { products, getAllProducts } = useProducts();

  useEffect(() => {
    getAllProducts();
  }, []);
  console.log(products);
  return (
    <>
      <Header />{" "}
      <ListContainer className="container-fluid">
        {products.map((product) => (
          <CardsList product={product} />
        ))}
      </ListContainer>
    </>
  );
}
