import styled from 'styled-components/macro';

export const Cart = styled.div`
  width: 100%;
`;
export const Name = styled.h1``;

export const Product = styled.article`
  border: 1px solid #eee;
  margin: 20px 0;
  width: 100%;
  height: 195px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  header,
  .content {
    background-color: #fff;
    border: 1px solid #ccc;
    border-style: none none solid none;
    float: left;
  }

  header {
    background: #000;
    margin: 0 1% 20px 0;
    overflow: hidden;
    padding: 0;
    position: relative;
    width: 24%;
    height: 195px;
  }
  header h3 {
    background: #53b5aa;
    color: #fff;
    font-size: 22px;
    font-weight: 300;
    line-height: 49px;
    margin: 0;
    padding: 0 30px;
    position: absolute;
    bottom: -50px;
    right: 0;
    left: 0;
  }

  h1 {
    color: #53b5aa;
    font-size: 25px;
    font-weight: 300;
    margin: 17px 0 20px 0;
  }
`;

export const Content = styled.div`
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  height: 140px;
  padding: 0 20px;
  width: 75%;
`;

export const Footer = styled.footer`
  .content {
    height: 50px;
    margin: 6px 0 0 0;
    padding: 0;
  }
  .price {
    background: #fcfcfc;
    color: #000;
    float: right;
    font-size: 15px;
    font-weight: 300;
    line-height: 49px;
    margin: 0;
    padding: 0 30px;
  }

  .full-price {
    background: #53b5aa;
    color: #fff;
    float: right;
    font-size: 22px;
    font-weight: 300;
    line-height: 49px;
    margin: 0;
    padding: 0 30px;
  }
  .default-price {
    background: #e6e6e6;
    color: #fff;
    float: right;
    font-size: 22px;
    font-weight: 300;
    line-height: 49px;
    margin: 0;
    padding: 0 30px;
  }
  .discount {
    color: #fff;
    float: right;
    font-size: 22px;
    font-weight: 300;
    line-height: 49px;
    margin: 0;
    padding: 0 30px;
    background-color: indianred;
  }
  .qt,
  .qt-plus,
  .qt-minus {
    display: block;
    float: left;
  }

  .qt {
    font-size: 19px;
    line-height: 50px;
    width: 70px;
    text-align: center;
  }

  .qt-plus,
  .qt-minus {
    background: #fcfcfc;
    border: none;
    font-size: 30px;
    font-weight: 300;
    height: 100%;
    padding: 0 20px;
  }

  .qt-plus:hover,
  .qt-minus:hover {
    background: #53b5aa;
    color: #fff;
    cursor: pointer;
  }

  .qt-plus {
    line-height: 50px;
  }

  .qt-minus {
    line-height: 47px;
  }
`;
