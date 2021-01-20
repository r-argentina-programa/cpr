import Header from "../../components/header";
import styled from "styled-components/macro";
import CardsList from "../../components/cardsList";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ProductContext } from "../../store/products/productContext";
import { BrandContext } from "../../store/brand/brandContext";
import { CategoryContext } from "../../store/category/categoryContext";

const ListContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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
  span {
    color: antiquewhite;
    margin-right: 1.2rem;
  }
`;

const Title = styled.h1`
  margin: 1rem 0;
  text-align: center;
  font-size: 2rem;
`;

export default function Main() {
  const {
    getAllProducts,
    products,
    getProductsByBrand,
    getProductsByCategory,
  } = useContext(ProductContext);
  const { getAllBrands, brands } = useContext(BrandContext);
  const { getAllCategories, categories } = useContext(CategoryContext);

  useEffect(() => {
    getAllProducts();
    getAllBrands();
    getAllCategories();
  }, []);
  return (
    <>
      <Header />
      <NavContainer>
        <span>Brands:</span>
        {brands.map((brand) => (
          <Link
            key={brand.id}
            to="#"
            brand-id={brand.id}
            onClick={(e) =>
              getProductsByBrand(e.target.getAttribute("brand-id"))
            }
          >
            {brand.name}
          </Link>
        ))}
      </NavContainer>
      <NavContainer>
        <span>Categories:</span>
        {categories.map((category) => (
          <Link
            key={category.id}
            to="#"
            category-id={category.id}
            onClick={(e) =>
              getProductsByCategory(e.target.getAttribute("category-id"))
            }
          >
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
