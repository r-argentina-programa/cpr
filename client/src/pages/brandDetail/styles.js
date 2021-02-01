import styled from 'styled-components/macro';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
  display: flex;

  @media (max-width: 940px) {
    flex-direction: column;
    margin-top: 60px;
  }
`;

export const ImageContainer = styled.div`
  width: 65%;
  position: relative;

  img {
    width: 100%;
    height: 30rem;
    position: absolute;
    left: 0;
    top: 0;
    margin: 1px solid red;
    transition: all 0.3s ease;

    @media (max-width: 940px) {
      width: 100%;
      img {
        width: 300px;
        right: 0;
        top: -65px;
        left: initial;
      }
    }
  }
`;

export const RightColumnContainer = styled.div`
  width: 35%;
  margin-top: 60px;

  @media (max-width: 940px) {
    width: 100%;
  }
`;

export const BrandDescription = styled.div`
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
`;

export const TimeStyle = styled.span`
  color: #999999;
  font-size: 10px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
`;

export const ProductsContainer = styled.div`
  margin-top: 15rem;
  align-items: center;
  border-top: 0.2rem dotted cadetblue;
  p {
    font-size: 3rem;
    color: cadetblue;
    text-align: center;
    font-weight: 250;
    span {
      font-weight: 400;
    }
  }
`;

export const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 0.2rem;
`;
