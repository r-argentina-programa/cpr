/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import Header from '../../components/header';
import { Container } from './styles';
import Item from './item';
import { ProductContext } from '../../store/products/productContext';

export default function ProductDetail() {
  const [products, setProducts] = useState([]);
  const { getCartFinalDiscounts, cartPrice } = useContext(ProductContext);

  useEffect(() => {
    const localCart = localStorage.getItem('cart');
    setProducts(JSON.parse(localCart));
  }, []);

  function handleCartData() {
    const productsId = products.map((product) => product.id);
    const productsAmount = products.map((product) => product.amount);
    getCartFinalDiscounts(productsId, productsAmount);
  }
  return (
    <>
      <Header />

      {!products || products.length === 0 ? (
        <h1
          style={{ textAlign: 'center', color: 'steelblue', marginTop: '3rem' }}
          className="no-items"
        >
          You do not have any products added to the cart!
        </h1>
      ) : (
        <Container className="table-responsive">
          <h1 className="title">Manage your cart and let us calculate the Final Price</h1>
          <Table striped hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Categories</th>
                <th>Default Price</th>
                <th> Price with Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <Item
                  product={product}
                  key={product.id}
                  cart={products}
                  setProducts={setProducts}
                />
              ))}
            </tbody>
          </Table>
          <Button className="submit" onClick={(e) => handleCartData(e)}>
            Submit data
          </Button>

          {cartPrice ? (
            <div className="cart-result">
              <h2>
                The final Price is: <span className="final-price">${cartPrice}</span>
              </h2>
            </div>
          ) : null}
        </Container>
      )}
    </>
  );
}
