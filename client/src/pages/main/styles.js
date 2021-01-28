import styled from 'styled-components/macro';

export const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 0.2rem;
`;

export const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  background-color: #343a40;
  a {
    margin-right: 1rem;
    text-decoration: none;
    color: #fff;
    font-size: 17px;

    &:hover {
      color: #e6e6e6;
    }
  }
  span,
  label {
    color: antiquewhite;
    margin-right: 1.2rem;
  }

  .item {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  .price-filter {
    @media (max-width: 480px) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

export const Title = styled.h1`
  margin: 1rem 0;
  text-align: center;
  font-size: 2rem;
`;
