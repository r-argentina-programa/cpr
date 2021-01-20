import Header from "../../components/header";
import styled from "styled-components/macro";
import CardsList from "../../components/cardsList";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ProductContext } from "../../store/products/productContext";

const ListContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NavContainer = styled.div`
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
  const brands = [];
  const products = [];
  const categories = [];
  const { getAllProducts } = useContext(ProductContext);

  useEffect(() => {}, []);

  return (
    <>
      <Header />
      <NavContainer>
        {brands.map((brand) => (
          <Link key={brand.id} to="#" brand-id={brand.id}>
            {brand.name}
          </Link>
        ))}
      </NavContainer>
      <NavContainer>
        {categories.map((category) => (
          <Link key={category.id} to="#" category-id={category.id}>
            {category.name}
          </Link>
        ))}
      </NavContainer>
      <Title>See all the products Here!</Title>
      <ListContainer className="container-fluid">
        {products.map((product) => (
          <CardsList
            key={product.id}
            item={product}
            imageSrc={product.imageSrc.data}
            link={`/product/${product.id}`}
          />
        ))}
      </ListContainer>
    </>
  );
}
