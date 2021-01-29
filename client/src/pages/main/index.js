/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/esm/Button';
import { useLocation } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import CardsList from '../../components/cardsList';
import Header from '../../components/header';
import { ProductContext } from '../../store/products/productContext';
import { BrandContext } from '../../store/brand/brandContext';
import { CategoryContext } from '../../store/category/categoryContext';
import { ListContainer, SidebarContainer, Container, ContentContainer } from './styles';

export default function Main() {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchWord = searchParams.get('search');
  const brandsQuery = searchParams.getAll('brand');
  const categoriesQuery = searchParams.getAll('category');
  const priceRangeQuery = searchParams.get('priceRange');
  const splittedPriceRange = priceRangeQuery ? priceRangeQuery.split('-') : [];
  const pageQuery = searchParams.get('page');
  const { products, getFilteredProducts, error, getProductBySearch } = useContext(ProductContext);
  const { getAllBrands, brands } = useContext(BrandContext);
  const { getAllCategories, categories } = useContext(CategoryContext);
  const [activeBrands, setActiveBrands] = useState(brandsQuery);
  const [activeCategories, setActiveCategories] = useState(categoriesQuery);
  const [price, setPrice] = useState({
    minPrice: splittedPriceRange[0] || 0,
    maxPrice: splittedPriceRange[1] || 0,
  });
  const [priceRange, setPriceRange] = useState(priceRangeQuery || '');
  const [searchTerm, setSearchTerm] = useState(searchWord || '');
  const [page, setPage] = useState(pageQuery || 1);

  function handleQueries() {
    const newSearchParams = new URLSearchParams();
    activeBrands.forEach((brand) => {
      newSearchParams.append('brand', brand);
    });
    activeCategories.forEach((category) => {
      newSearchParams.append('category', category);
    });
    if (searchTerm !== '') newSearchParams.set('search', searchTerm);
    if (page) newSearchParams.set('page', page);
    if (priceRange) newSearchParams.set('priceRange', priceRange);
    const refresh = `${window.location.protocol}//${window.location.host}${
      window.location.pathname
    }${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`;
    window.history.pushState({ path: refresh }, '', refresh);
  }

  useEffect(() => {
    getAllBrands();
    getAllCategories();
  }, []);

  useEffect(() => {
    handleQueries();
    getFilteredProducts(activeBrands, activeCategories, priceRange, page, searchTerm);
    getProductBySearch(searchWord);
  }, [activeBrands, activeCategories, priceRange]);

  function handleFilter() {
    setPriceRange(`${price.minPrice}-${price.maxPrice}`);
  }
  return (
    <>
      <Header />
      <Container clasName="container">
        <SidebarContainer>
          <ul className="filters">
            <li>
              Brands:
              {brands.map((brand) => (
                <ul className="item" key={brand.id}>
                  <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
                  <input
                    type="checkbox"
                    id={`brand-${brand.id}`}
                    value={brand.name}
                    checked={activeBrands.includes(brand.name)}
                    onChange={(e) => {
                      if (activeBrands.includes(e.target.value)) {
                        setActiveBrands(activeBrands.filter((name) => name !== e.target.value));
                      } else {
                        setActiveBrands([...activeBrands, e.target.value]);
                      }
                    }}
                  />
                </ul>
              ))}
            </li>
            <li>
              Categories:
              {categories.map((category) => (
                <ul className="item" key={category.id}>
                  <label htmlFor={`category-${category.id}`}>{category.name}</label>
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    value={category.name}
                    checked={activeCategories.includes(category.name)}
                    onChange={(e) => {
                      if (activeCategories.includes(e.target.value)) {
                        setActiveCategories(
                          activeCategories.filter((name) => name !== e.target.value)
                        );
                      } else {
                        setActiveCategories([...activeCategories, e.target.value]);
                      }
                    }}
                  />
                </ul>
              ))}
            </li>
            <div className="price-filter">
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
            </div>
          </ul>
        </SidebarContainer>
        <ContentContainer>
          <ListContainer className="container-fluid">
            {error && <Alert variant="danger">{error}</Alert>}
            {products.map((product) => (
              <CardsList
                key={product.id}
                item={product}
                imageSrc={product.imageSrc.data}
                link={`/product/${product.id}`}
              />
            ))}
          </ListContainer>
          <Pagination>{}</Pagination>
        </ContentContainer>
      </Container>
    </>
  );
}
