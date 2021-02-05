import styled from 'styled-components/macro';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
  display: flex;

  @media (max-width: 425px) {
    flex-direction: column;
    margin-top: 60px;
  }
`;

export const ImageContainer = styled.div`
  width: 65%;
  position: relative;
  img {
    width: 100%;
    left: 0;
    top: 0;
    transition: all 0.3s ease;
    max-height: 500px;
    display: block;
    margin: auto;
  }
  @media (max-width: 940px) {
    width: 50%;
    img {
      width: 300px;
      right: 0;
      top: -65px;
      left: initial;
    }
  }

  @media (max-width: 425px) {
    width: 100%;
    img {
      min-width: 280px;
      top: 0px;
    }
  }
`;

export const RightColumnContainer = styled.div`
  width: 35%;
  margin-top: 60px;

  @media (max-width: 940px) {
    width: 50%;
  }
  @media (max-width: 425px) {
    width: 100%;
  }
`;

export const ProductDescription = styled.div`
  border-bottom: 1px solid #e1e8ee;
  margin-bottom: 20px;

  span {
    font-size: 12px;
    color: #358ed7;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-decoration: none;
    margin-right: 0.9rem;
  }

  .brand {
    margin-left: 0.5rem;
    font-weight: 600;
  }

  h1 {
    font-weight: 300;
    font-size: 52px;
    color: #43484d;
    letter-spacing: -2px;
  }
  p {
    font-size: 16px;
    font-weight: 300;
    color: #86939e;
    line-height: 24px;
  }
`;

export const ProductPrice = styled.div`
  display: flex;
  align-items: center;

  span {
    font-size: 26px;
    font-weight: 300;
    color: #43474d;
    margin-right: 20px;
  }
  button.add-cart {
    display: inline-block;
    background-color: rgb(13, 101, 114);
    font-weight: 500;
    border-radius: 6px;
    font-size: 16px;
    color: #ffffff;
    text-decoration: none;
    padding: 12px 30px;
    transition: all 0.5s;
    &:hover {
      background-color: cadetblue;
    }
  }
`;

export const ListContainer = styled.div`
  h2 {
    font-size: 3rem;
    width: 100%;
    color: cadetblue;
    text-align: center;
    font-weight: 250;
  }
  .discount-table {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10rem;
    span {
      border: 1px solid red;
    }

    tbody tr:nth-child(1) {
      background-color: mediumaquamarine;
    }
  }

  .products-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    grid-gap: 0.2rem;
  }
`;
