import styled from "styled-components/macro";

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
  display: flex;
`;

export const ImageContainer = styled.div`
  width: 65%;
  position: relative;

  img {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    transition: all 0.3s ease;
  }
`;

export const RightColumnContainer = styled.div`
  width: 35%;
  margin-top: 60px;
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
`;
