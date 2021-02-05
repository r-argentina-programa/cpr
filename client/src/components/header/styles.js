import styled from 'styled-components/macro';

export const ContainerSearch = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 4px 8px 2px;
  font: 400 13.333px Arial;
  border-radius: 4px;
  outline: 0px;
  padding-left: 5px;

  label {
    display: flex;
    color: #fff;
  }
`;

export const CartQuantity = styled.span`
  display: inline-block;
  background-color: #5a7a99;
  width: 21px;
  border-radius: 80%;
  @media (max-width: 425px) {
    display: none;
  }
`;

export const SearchProductsLabel = styled.span`
  @media (max-width: 425px) {
    display: none;
  }
`;
