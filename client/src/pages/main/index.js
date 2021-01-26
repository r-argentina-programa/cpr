import { useContext, useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
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

  useEffect(() => {
    getAllProducts();
    getAllBrands();
    getAllCategories();
  }, []);

  useEffect(() => {
    getFilteredProducts(activeBrands, activeCategories);
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
