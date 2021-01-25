/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ab2str from 'arraybuffer-to-string';

import Header from '../../components/header';
import { Container } from './styles';

export default function ProductDetail() {
  const [products, setProducts] = useState([]);

  let [amount, setAmount] = useState(0);
  useEffect(() => {
    const localCart = localStorage.getItem('cart');
    setProducts(JSON.parse(localCart));
  }, []);

  function removeProduct(productId) {
    let productsCopy = [...products];

    productsCopy = productsCopy.filter((item) => item.id !== productId);
    setProducts(productsCopy);
    let cartString = JSON.stringify(productsCopy);
    localStorage.setItem('cart', cartString);
  }
  function configureImage(imageSrc) {
    const uint8 = new Uint8Array(imageSrc);
    return ab2str(uint8);
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
                <tr>
                  <td>
                    <img
                      src={`data:image/png;base64, ${configureImage(product.imageSrc.data)}`}
                      alt={product.name}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>
                    <Link to={`/brand/${product.brand.id}`} className="brand">
                      {product.brand.name}
                    </Link>
                  </td>
                  {product.categories.length !== 0 ? (
                    product.categories.map((category) => <td key={category.id}>{category.name}</td>)
                  ) : (
                    <td>No categories in this product</td>
                  )}

                  <td className="price">${product.defaultPrice}</td>
                  {product.discount ? (
                    product.discount.type === 'Fixed' ? (
                      <td className="price price-discount">
                        ${product.discount.finalPrice} (-${product.discount.value} OFF)
                      </td>
                    ) : (
                      <td className="price price-discount">
                        ${product.discount.finalPrice} (-%{product.discount.value} OFF)
                      </td>
                    )
                  ) : (
                    <td>This product has no discount.</td>
                  )}
                  <td>
                    <Button
                      variant="danger"
                      type="button"
                      className="button"
                      onClick={() => removeProduct(product.id)}
                    >
                      Delete
                    </Button>
                    <label htmlFor="amount">
                      Amount
                      <input type="number" id="amount" className="amount" name="amount" />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      )}
    </>
  );
}
