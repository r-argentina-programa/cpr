import styled from 'styled-components/macro';

export const ListContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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
`;

export const Title = styled.h1`
  margin: 1rem 0;
  text-align: center;
  font-size: 2rem;
`;
