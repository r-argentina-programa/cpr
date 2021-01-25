/* eslint-disable prefer-const */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import ab2str from 'arraybuffer-to-string';

import Header from '../../components/header';
import { Cart, Product, Name, Content, Footer } from './styles';

export default function ProductDetail() {
  let [amount, setAmount] = useState(0);
  function changeValue(e) {
    const operator = e.target.innerText;
    if (operator === '+') {
      setAmount((amount += 1));
    } else {
      setAmount((amount -= 1));
    }
  }
  return (
    <>
      <Header />
      <Cart className="cart">
        <Product className="product">
          <header>
            <img
              src="http://www.astudio.si/preview/blockedwp/wp-content/uploads/2012/08/1.jpg"
              alt=""
            />
            <h3>Remove product</h3>
          </header>

          <Content className="content">
            <Name>Lorem ipsum</Name>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta, numquam quis
            perspiciatis ea ad omnis provident laborum dolore in atque.
            <div
              title="You have selected this product to be shipped in the color yellow."
              style={{ top: 0 }}
              className="color yellow"
            />
            <div style={{ top: '43px' }} className="type small">
              XXL
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

            <h2 className="full-price">29.98€</h2>

            <h2 className="price">14.99€</h2>
          </Footer>
        </Product>
      </Cart>
    </>
  );
}
