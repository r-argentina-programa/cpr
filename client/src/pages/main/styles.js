import styled from 'styled-components/macro';

export const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1rem;
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

  .item {
    > label {
      padding-left: 5px;
    }
  }

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
    margin-top: 0.8rem;
    padding: 18px;
    text-align: left;
    span {
      width: 80px;
      display: inline-block;
    }
    button {
      margin-top: 0.8rem;
      width: 100%;
    }
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
  min-height: calc(100vh - 78px);
`;

export const ContentContainer = styled.div`
  width: 100%;

  .title {
    text-align: center;
    color: rgb(13, 101, 110);
    margin: 2rem 0;
  }
`;
