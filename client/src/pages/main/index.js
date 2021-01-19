import { useEffect } from "react";
import Header from "../../components/header";
import { useProducts } from "../../hooks/products";
import styled from "styled-components/macro";
import CardsList from "../../components/cardsList";
import { useBrand } from "../../hooks/brands";
import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/categories";

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
  const { products, getAllProducts, setProducts } = useProducts();
  const { getAllBrands, brands, getProductsFromABrand, data } = useBrand();
  const {
    getAllCategories,
    categories,
    getProductsFromCategory,
    dataCategories,
  } = useCategories();

  useEffect(() => {
    getAllProducts();
    getAllBrands();
    getAllCategories();
  }, []);

  async function changeProductsData(id) {
    await getProductsFromABrand(id);
    setProducts(data);
  }

  async function changeProductsDataByCategory(id) {
    await getProductsFromCategory(id);
    await setProducts(dataCategories);
  }
  return (
    <>
      <Header />
      <NavContainer>
        {brands.map((brand) => (
          <Link
            key={brand.id}
            to="#"
            brand-id={brand.id}
            onClick={(e) =>
              changeProductsData(e.target.getAttribute("brand-id"))
            }
          >
            {brand.name}
          </Link>
        ))}
      </NavContainer>
      <NavContainer>
        {categories.map((category) => (
          <Link
            key={category.id}
            to="#"
            category-id={category.id}
            onClick={(e) =>
              changeProductsDataByCategory(e.target.getAttribute("category-id"))
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
