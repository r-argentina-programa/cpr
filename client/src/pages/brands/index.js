import { useEffect } from "react";
import styled from "styled-components";
import CardsList from "../../components/cardsList";
import Header from "../../components/header";
import { UseBrand } from "../../hooks/brands";

const Title = styled.h1`
  margin: 1rem 0;
  text-align: center;
  font-size: 2rem;
`;

const ListContainer = styled.div`
  display: flex;
  align-items: center;
`;

export default function Brands() {
  const { getAllBrands, brands } = UseBrand();

  useEffect(() => {
    getAllBrands();
  }, []);
  return (
    <>
      <Header />
      <Title>See all brands Here!</Title>
      <ListContainer className="container-fluid">
        {brands.map((brand) => (
          <CardsList item={brand} imageSrc={brand.logo.data} />
        ))}
      </ListContainer>
    </>
  );
}
