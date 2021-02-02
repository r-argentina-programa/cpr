/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/esm/Button';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

import { useLocation } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import CardsList from '../../components/cardsList';
import Header from '../../components/header';
import PaginationComponent from '../../components/Pagination';
import { ProductContext } from '../../store/products/productContext';
import { BrandContext } from '../../store/brand/brandContext';
import { CategoryContext } from '../../store/category/categoryContext';
import { ListContainer, SidebarContainer, Container, ContentContainer } from './styles';

export default function Main() {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchWord = searchParams.get('search');
  const brandsQuery = searchParams.get('brand')
    ? searchParams.getAll('brand')
    : searchParams.getAll('brand[]');
  const categoriesQuery = searchParams.get('category')
    ? searchParams.getAll('category')
    : searchParams.getAll('category[]');
  const priceRangeQuery = searchParams.get('priceRange');
  const splittedPriceRange = priceRangeQuery ? priceRangeQuery.split('-') : [];
  const pageQuery = searchParams.get('page');

  const {
    products,
    getFilteredProducts,
    error,
    loading,
    numberOfProducts,
    getNumberOfProducts,
  } = useContext(ProductContext);
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
  const [page, setPage] = useState(Number(pageQuery) || 1);
  let query;

  function handleQueries() {
    const newSearchParams = new URLSearchParams();
    activeBrands.forEach((brand) => {
      const prefix = activeBrands.length === 1 ? 'brand' : 'brand[]';
      newSearchParams.append(prefix, brand);
    });
    activeCategories.forEach((category) => {
      const prefix = activeCategories.length === 1 ? 'category' : 'category[]';
      newSearchParams.append(prefix, category);
    });
    if (searchTerm) newSearchParams.set('search', searchTerm);
    if (page) newSearchParams.set('page', page);
    if (priceRange) newSearchParams.set('priceRange', priceRange);
    const refresh = `${window.location.protocol}//${window.location.host}${
      window.location.pathname
    }${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`;
    query = newSearchParams.toString();
    window.history.pushState({ path: refresh }, '', refresh);
  }

  useEffect(() => {
    getAllBrands();
    getAllCategories();
  }, []);

  useEffect(() => {
    handleQueries();
    getNumberOfProducts(query);
    getFilteredProducts(activeBrands, activeCategories, priceRange, page, searchTerm);
    if (page !== 1) {
      setPage(1);
    }
  }, [activeBrands, activeCategories, priceRange, searchTerm]);

  useEffect(() => {
    handleQueries();
    getFilteredProducts(activeBrands, activeCategories, priceRange, page, searchTerm);
  }, [page]);

  function setCurrentPage(newPage) {
    setPage(newPage);
  }

  function setCurrentSearchTerm(newTerm) {
    setSearchTerm(newTerm);
  }

  function handleFilter() {
    setPriceRange(`${price.minPrice}-${price.maxPrice}`);
  }
  console.log(products);

  return (
    <>
      <Header setCurrentSearchTerm={setCurrentSearchTerm} />
      <Container clasName="container">
        <SidebarContainer>
          <Accordion allowMultipleExpanded allowZeroExpanded>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton style={{ background: 'inherit', color: 'white' }}>
                  Brands
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel style={{ textAlign: 'left' }}>
                {brands.map((brand) => (
                  <div className="item" key={brand.id}>
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
                    <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
                  </div>
                ))}
              </AccordionItemPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButton style={{ background: 'inherit', color: 'white' }}>
                  Categories
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel style={{ textAlign: 'left' }}>
                {categories.map((category) => (
                  <div className="item" key={category.id}>
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
                    <label htmlFor={`category-${category.id}`}>{category.name}</label>
                  </div>
                ))}
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
          <div className="price-filter">
            <p>Price</p>
            <div>
              <label htmlFor="min-price">
                <span>Min Price</span>
                <input
                  type="number"
                  id="min-price"
                  name="min-price"
                  min="0"
                  value={price.minPrice}
                  style={{ width: '30%' }}
                  onChange={(e) => setPrice({ ...price, minPrice: e.target.value })}
                />
              </label>
              <label htmlFor="max-price">
                <span>Max Price</span>
                <input
                  type="number"
                  id="max-price"
                  min="0"
                  name="max-price"
                  style={{ width: '30%' }}
                  value={price.maxPrice}
                  onChange={(e) => setPrice({ ...price, maxPrice: e.target.value })}
                />
              </label>
              <Button
                style={{ backgroundColor: '#0D6572', borderColor: '#0D6572' }}
                onClick={() => handleFilter()}
              >
                Filter
              </Button>
            </div>
          </div>
        </SidebarContainer>
        {loading ? (
          <Spinner animation="border" role="status" style={{ margin: '2rem auto' }}>
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <ContentContainer>
            {error && <Alert variant="danger">{error}</Alert>}
            <h1 className="title">See all the products here!</h1>
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
            <PaginationComponent
              numberOfProducts={numberOfProducts}
              page={page}
              setCurrentPage={setCurrentPage}
            />
          </ContentContainer>
        )}
      </Container>
    </>
  );
}
