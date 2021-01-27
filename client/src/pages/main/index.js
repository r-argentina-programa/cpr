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
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: Infinity });
  const [price, setPrice] = useState({
    minPrice: 0,
    maxPrice: 0,
  });

  useEffect(() => {
    getFilteredProducts(activeBrands, activeCategories, priceRange);
  }, [activeBrands, activeCategories, priceRange]);

  useEffect(() => {
    getAllProducts();
    getAllBrands();
    getAllCategories();
  }, []);

  function handleFilter() {
    setPriceRange(price);
  }
  return (
    <>
      <Header />
      <NavContainer>
        <span>Brands:</span>
        {brands.map((brand) => (
          <div className="item" key={brand.id}>
            <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
            <input
              type="checkbox"
              id={`brand-${brand.id}`}
              value={brand.id}
              onClick={(e) => {
                if (activeBrands.includes(e.target.value)) {
                  setActiveBrands(activeBrands.filter((id) => id !== e.target.value));
                } else {
                  setActiveBrands([...activeBrands, e.target.value]);
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
            <label htmlFor={`category-${category.id}`}>{category.name}</label>
            <input
              type="checkbox"
              id={`category-${category.id}`}
              value={category.id}
              onClick={(e) => {
                if (activeCategories.includes(e.target.value)) {
                  setActiveCategories(activeCategories.filter((id) => id !== e.target.value));
                } else {
                  setActiveCategories([...activeCategories, e.target.value]);
                }
              }}
            />
          </div>
        ))}
      </NavContainer>
      <NavContainer>
        <label htmlFor="min-price">
          Min Price:
          <input
            type="number"
            id="min-price"
            name="min-price"
            min="0"
            value={price.minPrice}
            onChange={(e) => setPrice({ ...price, minPrice: e.target.value })}
          />
        </label>
        <label htmlFor="max-price">
          Max Price:
          <input
            type="number"
            id="max-price"
            min="0"
            name="max-price"
            value={price.maxPrice}
            onChange={(e) => setPrice({ ...price, maxPrice: e.target.value })}
          />
        </label>
        <Button
          style={{ backgroundColor: '#0D6572', borderColor: '#0D6572' }}
          onClick={() => handleFilter()}
        >
          Filter Products
        </Button>
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
