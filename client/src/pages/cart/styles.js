/* eslint-disable import/prefer-default-export */
import styled from 'styled-components/macro';

export const Container = styled.div`
  img {
    max-width: 100%;
    max-height: 10rem;
  }
  .title {
    text-align: center;
    color: rgb(13, 101, 110);
    margin: 2rem 0;
  }
  .price {
    font-size: 1.5rem;
    text-align: center;
  }
  .price-discount {
    color: steelblue;
  }
  .brand {
    font-size: 0.8rem;
    color: #358ed7;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;
    margin-right: 0.9rem;
  }
  label {
    margin-left: 0.8rem;
  }
  .amount {
    width: 3rem;
    margin-left: 1rem;
  }

  .title {
    text-align: center;
    color: rgb(13, 101, 110);
    margin: 2rem 0;
  }

  .submit {
    width: 100%;
    background-color: rgb(13, 101, 114);
    border-color: rgb(13, 101, 114);
  }
  h2 {
    font-weight: 500;
  }
  .finalPrice {
    font-weight: 800;
  }

  .discounts {
    font-size: 12px;
    text-decoration: line-through;
    color: darkgrey;
  }
  .discount-title {
    font-size: 20px;
    color: darkgrey;
    display: grid;
  }

  .cart-result {
    text-align: center;
    margin: 1rem 0;
    background: e6e6e6;
    .final-price {
      font-weight: 700;
    }
  }

  .price-discount {
    ul {
      font-size: 1rem;
      border: 1px solid;
      margin: 1px 0;
    }
    li {
      list-style: none;
      font-size: 1rem;
      text-align: left;
    }
  }
`;
