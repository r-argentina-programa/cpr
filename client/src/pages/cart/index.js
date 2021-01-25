/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import ab2str from 'arraybuffer-to-string';

import Header from '../../components/header';
import { Cart, Product, Name, Content, Footer } from './styles';

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
  return (
    <>
      <Header />

      {products ? (
        products.map((product) => (
          <Cart className="cart" key={product.id}>
            <Product className="product">
              <header>
                <img
                  alt="product"
                  src={`data:image/png;base64, ${configureImage(product.imageSrc.data)}`}
                />
              </header>

              <Content className="content">
                <Name>{product.name}</Name>
                {product.description}
                <div style={{ top: '43px' }} className="type small">
                  <Link to={`/brand/${product.brand.id}`}>{product.brand.name}</Link>
                </div>
              </Content>

              <Footer className="content">
                <button type="button" className="qt-minus" onClick={changeValue}>
                  -
                </button>
                <span className="qt">{amount}</span>
                <button type="button" className="qt-plus" onClick={changeValue}>
                  +
                </button>

                {product.discount.finalPrice ? (
                  product.discount.type === 'Fixed' ? (
                    <>
                      <h2 className="full-price">${product.discount.finalPrice}</h2>
                      <span className="discount">-${product.discount.value} OFF</span>
                    </>
                  ) : (
                    <>
                      <h2 className="full-price">${product.discount.finalPrice}</h2>
                      <span className="discount">-%{product.discount.value} OFF</span>
                    </>
                  )
                ) : (
                  <h2 className="default-price">${product.defaultPrice}</h2>
                )}

                <h2 className="price">${product.defaultPrice}</h2>
              </Footer>
            </Product>
          </Cart>
        ))
      ) : (
        <p>Loading... please wait</p>
      )}
    </>
  );
}
