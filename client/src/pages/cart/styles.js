/* eslint-disable import/prefer-default-export */
import styled from 'styled-components/macro';

export const Container = styled.div`
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
  label {
    margin-left: 0.8rem;
  }
  .amount {
    width: 3rem;
    margin-left: 1rem;
  }

  .title {
    text-align: center;
    color: steelblue;
    margin: 2rem 0;
  }

  .submit {
    width: 100%;
    background-color: steelblue;
  }
  h2 {
    font-weight: 500;
  }
  .finalPrice {
    font-weight: 800;
  }
`;
