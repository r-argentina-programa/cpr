import { useEffect } from "react";
import Header from "../../components/header";
import { useProducts } from "../../hooks/products";
import styled from "styled-components/macro";
import CardsList from "../../components/cardsList";
import { UseBrand } from "../../hooks/brands";

const ListContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BrandsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  background-color: #343a40;
  a {
    margin-right: 1rem;
    text-decoration: none;
    color: #fff;
    font-size: 17px;

    &:hover {
      color: #e6e6e6;
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
      <Header />
      <BrandsContainer>
        {brands.map((brand) => (
          <a href="/">{brand.name}</a>
        ))}
      </BrandsContainer>
      <Title>See all the products Here!</Title>
      <ListContainer className="container-fluid">
        {products.map((product) => (
          <CardsList item={product} imageSrc={product.imageSrc.data} />
        ))}
      </ListContainer>
    </>
  );
}
