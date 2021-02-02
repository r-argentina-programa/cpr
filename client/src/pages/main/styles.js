import styled from 'styled-components/macro';

export const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  @media (max-width: 700px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 1rem;
    justify-items: center;
    .img-container {
      max-height: 200px;
    }
  }
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

export const Container = styled.div`
  display: flex;
  flex: 1;
  min-height: calc(100vh - 78px);
  @media (max-width: 700px) {
    display: block;
  }
`;

export const ContentContainer = styled.div`
  width: 100%;
  .title {
    text-align: center;
    color: rgb(13, 101, 110);
    margin: 2rem 0;
  }
`;
