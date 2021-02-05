/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import ab2str from 'arraybuffer-to-string';
import { Table } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { ProductContext } from '../../store/products/productContext';
import { CategoryContext } from '../../store/category/categoryContext';

import {
  Container,
  ImageContainer,
  ProductDescription,
  RightColumnContainer,
  ProductPrice,
  ListContainer,
} from './styles';
import Header from '../../components/header';
import CardsList from '../../components/cardsList';

export default function ProductDetail() {
  const { id } = useParams();
  const [image, setImage] = useState('');
  const { product, getProductDetails, error, getProductsByBrand, loading } = useContext(
    ProductContext
  );
  let { products: productsByBrand } = useContext(ProductContext);
  const { products: productsByCategory, getProductsByCategories } = useContext(CategoryContext);
  const [cart, setCart] = useState([]);
  const [status, setStatus] = useState('');

  let localCart = localStorage.getItem('cart');

  useEffect(() => {
    if (product.name) {
      document.title = `Smarket - ${product.name} - Detail page`;
    }
  }, [product]);

  useEffect(() => {
    localCart = JSON.parse(localCart);
    if (localCart) {
      setCart(localCart);
    }
  }, []);

  useEffect(() => {
    getProductDetails(id);
  }, [id]);

  useEffect(() => {
    let uint8;
    if (product.imageSrc) {
      uint8 = new Uint8Array(product.imageSrc.data);
    }
    setImage(ab2str(uint8));
    if (product.brand) {
      getProductsByBrand(product.brand.id);
    }
    if (product.categories) {
      const query = product.categories.map((e) => `category=${e.name}`).join('&');
      getProductsByCategories(query);
    }
  }, [product]);

  function addProductToCart(productToSave) {
    const cartCopy = [...cart];
    const existingProduct = cartCopy.find((productItem) => productItem.id === productToSave.id);
    if (!existingProduct) {
      cartCopy.push(productToSave);
      setStatus(`${productToSave.name} has been successfully added to the cart.`);
    } else {
      setStatus(`${productToSave.name} is already in your Cart!`);
    }

    setCart(cartCopy);

    const stringCart = JSON.stringify(cartCopy);
    localStorage.setItem('cart', stringCart);
  }

  productsByBrand = productsByBrand.filter((productItem) => productItem.id !== Number(id));
  return (
    <>
      <Header />
      {error ? (
        <Alert variant="danger" style={{ textAlign: 'center' }}>
          {error}
        </Alert>
      ) : null}
      {status && (
        <Alert variant="info" style={{ textAlign: 'center' }} data-cy="status-container">
          {status}
        </Alert>
      )}

      {loading ? (
        <Spinner animation="border" role="status" style={{ margin: '2rem auto', display: 'block' }}>
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        product.name && (
          <>
            <Container data-cy="product-container">
              <ImageContainer>
                <img src={`data:image/png;base64, ${image}`} alt="product" />
              </ImageContainer>

              <RightColumnContainer>
                <ProductDescription data-cy="product-description">
                  {product.categories &&
                    product.categories.map((category) => (
                      <span key={category.id}>{category.name}</span>
                    ))}
                  <h1>{product.name}</h1>
                  <p>{product.description}</p>
                  <div className="brandContainer">
                    <p>
                      Made by
                      <Link to={`/brand/${product.brand.id}`} className="brand">
                        {product.brand.name}
                      </Link>
                    </p>
                  </div>
                </ProductDescription>

                <ProductPrice data-cy="product-price-container">
                  {product.discount ? (
                    <>
                      <span style={{ textDecoration: 'line-through' }} data-cy="default-price">
                        ${product.defaultPrice}
                      </span>
                      <span
                        style={{
                          color: 'red',
                          border: '1px solid red',
                          padding: '.4rem',
                        }}
                        data-cy="discount-price"
                      >
                        ${product.discount.finalPrice}
                      </span>
                    </>
                  ) : (
                    <span data-cy="default-price">${product.defaultPrice}</span>
                  )}
                  <br />
                  <button
                    data-cy="add-product-to-cart-button"
                    type="button"
                    className="add-cart"
                    onClick={() => addProductToCart(product)}
                  >
                    Add to Cart
                  </button>
                </ProductPrice>
              </RightColumnContainer>
            </Container>
            <ListContainer>
              {product.discounts.length !== 0 ? (
                <>
                  <div className="discount-table">
                    <h2>Other Discounts for this product:</h2>

                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Discount Type</th>
                          <th>Discount Value</th>
                          <th>Final Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.discounts.map((discount) => (
                          <tr key={discount.id} data-cy="product-discounts-container">
                            <td>{discount.type}</td>
                            <td>{discount.value}</td>
                            <td>${discount.finalPrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </>
              ) : (
                <h2 style={{ marginTop: '16rem' }}>There are no discounts in this product</h2>
              )}
            </ListContainer>
            {productsByBrand.length > 1 && (
              <ListContainer>
                <h2 style={{ marginTop: '3rem' }}>Other Products From {product.brand.name}</h2>
                <div className="products-list" data-cy="products-with-same-brand-container">
                  {productsByBrand.map((productByBrand) => (
                    <CardsList
                      key={productByBrand.id}
                      item={productByBrand}
                      imageSrc={productByBrand.imageSrc.data}
                      link={`/product/${productByBrand.id}`}
                    />
                  ))}
                </div>
              </ListContainer>
            )}

            {productsByCategory.length > 1 && (
              <ListContainer>
                <h2 style={{ marginTop: '3rem' }}>Related Products</h2>
                <div className="products-list" data-cy="related-products-container">
                  {productsByCategory.map((productByCategory) => (
                    <CardsList
                      key={productByCategory.id}
                      item={productByCategory}
                      imageSrc={productByCategory.imageSrc.data}
                      link={`/product/${productByCategory.id}`}
                    />
                  ))}
                </div>
              </ListContainer>
            )}
          </>
        )
      )}
    </>
  );
}
