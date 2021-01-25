/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

import Header from '../../components/header';
import { Container } from './styles';
import Item from './item';

export default function ProductDetail() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const localCart = localStorage.getItem('cart');
    setProducts(JSON.parse(localCart));
  }, []);

  function handleCartData() {
    console.log(products);
  }

  return (
    <>
      <Header />

      {products.length === 0 ? (
        <h1
          style={{ textAlign: 'center', color: 'steelblue', marginTop: '3rem' }}
          className="no-items"
        >
          You do not have any products added to the cart!
        </h1>
      ) : (
        <Container>
          <Table striped hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Categories</th>

                <th>Default Price</th>
                <th>Final Price (with Discount)</th>
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
          <Button onClick={(e) => handleCartData(e)}>Submit data</Button>
        </Container>
      )}
    </>
  );
}
