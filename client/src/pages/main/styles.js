import styled from 'styled-components/macro';

export const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const SidebarContainer = styled.div`
  flex: 0 0 20rem;
  padding: 1rem;
  transition: margin-left 0.3s ease;
  padding: 0.5rem 0;
  background-color: #343a40;
  color: white;
  list-style: none;
  text-align: center;
  min-height: 100%;

  .filters {
    padding: 0;
    > li {
      padding: 1rem;
      &:hover {
        ul {
          display: block;
        }
      }
      label {
        padding: 0.5rem;
        color: white;
        text-decoration: none;
        transition: padding-left 0.3s ease;
        border-bottom: 1px solid grey;
        &:hover {
          background-color: #2f2f2f;
          padding-left: 2rem;
          cursor: pointer;
        }
      }
      ul {
        margin-top: 1rem;
        display: none;
        list-style: none;
        background-color: #343a40;
        li {
          margin-bottom: 1rem;

          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .price-filter {
    margin-top: 2rem;
  }
`;

export const Title = styled.h1`
  margin: 1rem 0;
  text-align: center;
  font-size: 2rem;
`;

export const Container = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;
`;

export const ContentContainer = styled.div``;
