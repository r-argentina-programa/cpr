import styled from "styled-components";
import CardsList from "../../components/cardsList";
import Header from "../../components/header";

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
  const brands = [];
  return (
    <>
      <Header />
      <Title>See all brands Here!</Title>
      <ListContainer className="container-fluid">
        {brands.map((brand) => (
          <CardsList
            item={brand}
            imageSrc={brand.logo.data}
            link={`/brand/${brand.id}`}
            key={brand.id}
          />
        ))}
      </ListContainer>
    </>
  );
}
