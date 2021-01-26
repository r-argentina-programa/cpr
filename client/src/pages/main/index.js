/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/esm/Button';

import CardsList from '../../components/cardsList';
import Header from '../../components/header';
import { ProductContext } from '../../store/products/productContext';
import { BrandContext } from '../../store/brand/brandContext';
import { CategoryContext } from '../../store/category/categoryContext';
import { ListContainer, NavContainer, Title } from './styles';

export default function Main() {
  const { getAllProducts, products, getFilteredProducts, error } = useContext(ProductContext);
  const { getAllBrands, brands } = useContext(BrandContext);
  const { getAllCategories, categories } = useContext(CategoryContext);
  const [activeBrands, setActiveBrands] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [price, setPrice] = useState({
    minPrice: 0,
    maxPrice: 0,
  });

  useEffect(() => {
    getFilteredProducts(activeBrands, activeCategories, price);
  }, [activeBrands, activeCategories]);

  useEffect(() => {
    getAllProducts();
    getAllBrands();
    getAllCategories();
  }, []);

  function handleFilter() {
    getFilteredProducts(activeBrands, activeCategories, price);
  }

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
      <NavContainer>
        <label htmlFor="price">
          Min Price:
          <input
            type="number"
            id="price"
            name="min-price"
            value={price.minPrice}
            onChange={(e) => setPrice({ ...price, minPrice: e.target.value })}
          />
        </label>
        <label htmlFor="price">
          Max Price:
          <input
            type="number"
            id="price"
            name="max-price"
            value={price.maxPrice}
            onChange={(e) => setPrice({ ...price, maxPrice: e.target.value })}
          />
        </label>
        <Button onClick={() => handleFilter()}>Filter Products</Button>
      </NavContainer>
      {error && <Alert variant="danger">{error}</Alert>}
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
