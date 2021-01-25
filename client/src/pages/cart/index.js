/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ab2str from 'arraybuffer-to-string';
import styled from 'styled-components/macro';

import Header from '../../components/header';

export default function ProductDetail() {
  let [amount, setAmount] = useState(1);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const localCart = localStorage.getItem('cart');
    setProducts(JSON.parse(localCart));
  }, []);

  function changeValue(e) {
    const operator = e.target.innerText;

    if (amount >= 0) {
      if (operator === '+') {
        setAmount((amount += 1));
      } else {
        setAmount((amount -= 1));
      }
    }
  }
  function configureImage(imageSrc) {
    const uint8 = new Uint8Array(imageSrc);
    return ab2str(uint8);
  }

  const Container = styled.div`
    img {
      max-width: 100%;
      max-height: 10rem;
    }
    .price {
      font-size: 1.5rem;
      text-align: center;
    }
    .price-discount {
      color: lightsalmon;
    }
    .brand {
      font-size: 0.8rem;
      color: #358ed7;
      letter-spacing: 1px;
      text-transform: uppercase;
      text-decoration: none;
      margin-right: 0.9rem;
    }
  `;

  console.log(products);
  return (
    <>
      <Header />

      {products.length === 0 ? (
        <h1>You do not have any products added to the cart!</h1>
      ) : (
        <Container>
          <Table striped hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Categories</th>
                <th>Description</th>
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
                  <Link to={`/brand/${product.brand.id}`} className="brand">
                    <td>{product.brand.name}</td>
                  </Link>
                  {product.categories.length !== 0 ? (
                    product.categories.map((category) => <td key={category.id}>{category.name}</td>)
                  ) : (
                    <td>No categories in this product</td>
                  )}
                  <td>{product.description}</td>
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
                    <Button variant="danger" type="button" className="button">
                      Delete
                    </Button>
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
