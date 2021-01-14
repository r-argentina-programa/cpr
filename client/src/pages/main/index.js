import { useEffect } from "react";
import Header from "../../components/header";
import { useProducts } from "../../hooks/products";
import styled from "styled-components/macro";
import CardsList from "../../components/productsList";
import { UseBrand } from "../../hooks/brands";

const ListContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BrandsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  background-color: aliceblue;
  a {
    margin-right: 1rem;
    text-decoration: none;
    color: darkblue;

    &:hover {
      border: 1px solid hsla(0, 0%, 100%, 0.4);
      color: blue;
    }
  }
`;

const Title = styled.h1`
  margin: 1rem 0;
  text-align: center;
  font-size: 2rem;
`;

export default function Main() {
  const { products, getAllProducts } = useProducts();
  const { getAllBrands, brands } = UseBrand();
  useEffect(() => {
    getAllProducts();
    getAllBrands();
  }, []);
  return (
    <>
      <Header />{" "}
      <BrandsContainer>
        {brands.map((brand) => (
          <a href="/">{brand.name}</a>
        ))}
      </BrandsContainer>
      <Title>See all the products Here!</Title>
      <ListContainer className="container-fluid">
        {products.map((product) => (
          <CardsList product={product} />
        ))}
      </ListContainer>
    </>
  );
}
