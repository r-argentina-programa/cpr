import styled from 'styled-components/macro';
import { useContext, useEffect, useState } from 'react';
import CardsList from '../../components/cardsList';
import Header from '../../components/header';
import { ProductContext } from '../../store/products/productContext';
import { BrandContext } from '../../store/brand/brandContext';
import { CategoryContext } from '../../store/category/categoryContext';

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
  span,
  label {
    color: antiquewhite;
    margin-right: 1.2rem;
  }

  .item {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }
`;

const Title = styled.h1`
  margin: 1rem 0;
  text-align: center;
  font-size: 2rem;
`;

export default function Main() {
  const { getAllProducts, products, getFilteredProducts } = useContext(ProductContext);
  const { getAllBrands, brands } = useContext(BrandContext);
  const { getAllCategories, categories } = useContext(CategoryContext);
  const [activeBrands, setActiveBrands] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  useEffect(() => {
    getAllProducts();
    getAllBrands();
    getAllCategories();
  }, []);

  useEffect(() => {
    getFilteredProducts(activeBrands, activeCategories);

    if (activeBrands.length === 0 && activeCategories.length === 0) {
      getAllProducts();
    }
  }, [activeBrands, activeCategories]);

  return (
    <>
      <Header />
      <NavContainer>
        <span>Brands:</span>
        {brands.map((brand) => (
          <div className="item" key={brand.id}>
            <label htmlFor={brand.id}>{brand.name}</label>
            <input
              type="checkbox"
              id={brand.id}
              value={brand.id}
              onClick={(e) => {
                if (activeBrands.includes(e.target.id)) {
                  setActiveBrands(activeBrands.filter((id) => id !== e.target.id));
                } else {
                  setActiveBrands([...activeBrands, e.target.id]);
                }
              }}
            />
          </div>
        ))}
      </NavContainer>
      <NavContainer>
        <span>Categories:</span>
        {categories.map((category) => (
          <div className="item" key={category.id}>
            <label htmlFor={category.id}>{category.name}</label>
            <input
              type="checkbox"
              id={category.id}
              value={category.id}
              onClick={(e) => {
                if (activeCategories.includes(e.target.id)) {
                  setActiveCategories(activeCategories.filter((id) => id !== e.target.id));
                } else {
                  setActiveCategories([...activeCategories, e.target.id]);
                }
              }}
            />
          </div>
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
