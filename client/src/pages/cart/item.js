/* eslint-disable react/jsx-indent */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import Button from 'react-bootstrap/Button';
import ab2str from 'arraybuffer-to-string';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Item({ product, cart, setProducts, discounts, priceWithDiscounts }) {
  const [amount, setAmount] = useState(0);

  function configureImage(imageSrc) {
    const uint8 = new Uint8Array(imageSrc);
    return ab2str(uint8);
  }

  function deleteProduct(productId) {
    let cartCopy = [...cart];
    cartCopy = cartCopy.filter((item) => item.id !== productId);
    setProducts(cartCopy);

    let cartString = JSON.stringify(cartCopy);
    localStorage.setItem('cart', cartString);
  }

  function handleAmount(e) {
    setAmount(e.target.value);
    product.amount = e.target.value;
  }

  return (
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
        <td>{product.categories.map((category) => category.name)}</td>
      ) : (
        <td>No categories in this product</td>
      )}

      <td className="price">${product.defaultPrice}</td>
      {discounts ? (
        <td className="price price-discount">
          {discounts.map((discount) => (
            <ul>
              <li> Type: {discount.type}</li>
              <li>Value: {discount.value}</li>
            </ul>
          ))}
        </td>
      ) : product.discount ? (
        product.discount.type === 'Fixed' ? (
          <td className="price price-discount">
            ${product.discount.finalPrice} (-${product.discount.value} OFF)
            <b className="discount-title"> Another Discounts:</b>
            {product.discounts.length > 1 ? (
              product.discounts.map((discount) => (
                <p className="discounts" key={discount.id}>
                  Type: {discount.type}, value:{discount.value}, finalPrice: {discount.finalPrice}
                </p>
              ))
            ) : (
              <small>This product has no more Discounts</small>
            )}
          </td>
        ) : (
          <td className="price price-discount">
            ${product.discount.finalPrice} (-%{product.discount.value} OFF)
            <b className="discount-title"> Another Discounts:</b>
            {product.discounts.length > 1 ? (
              product.discounts.map((discount) => (
                <p className="discounts" key={discount.id}>
                  Type: {discount.type}, value:{discount.value}, finalPrice: {discount.finalPrice}
                </p>
              ))
            ) : (
              <small>This product has no more Discounts</small>
            )}
          </td>
        )
      ) : (
        <td>This product has no discount.</td>
      )}
      {discounts ? (
        product.discount && <td className="price price-discount">${priceWithDiscounts}</td>
      ) : (
        <td className="price price-discount">No discount Applied</td>
      )}
      <td>
        <Button
          variant="danger"
          type="button"
          className="button"
          onClick={(e) => deleteProduct(product.id)}
        >
          Delete
        </Button>
        <label htmlFor="amount">
          Amount
          <input
            style={{ marginLeft: '1rem', width: '3rem' }}
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmount}
            name="amount"
          />
        </label>
      </td>
    </tr>
  );
}
