import { useEffect } from "react";
import Header from "../../components/header";
import { useProducts } from "../../hooks/products";
import styled from "styled-components/macro";
import CardsList from "../../components/cardsList";
import { UseBrand } from "../../hooks/brands";
import { Link } from "react-router-dom";

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
  const { products, getAllProducts, setProducts } = useProducts();
  const { getAllBrands, brands, getProductsFromABrand, data } = UseBrand();

  useEffect(() => {
    getAllProducts();
    getAllBrands();
  }, []);

  function changeProductsData(id) {
    getProductsFromABrand(id);
    setProducts(data);
  }

  console.log(products);

  return (
    <>
      <Header />
      <BrandsContainer>
        {brands.map((brand) => (
          <Link
            key={brand.id}
            to="#"
            data-id={brand.id}
            onClick={(e) =>
              changeProductsData(e.target.getAttribute("data-id"))
            }
          >
            {brand.name}
          </Link>
        ))}
      </BrandsContainer>
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
