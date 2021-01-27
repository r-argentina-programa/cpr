import styled from 'styled-components/macro';

export const TimeStyle = styled.span`
  color: #575757;
  font-size: 10px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  display: block;
`;

export const Container = styled.div`
  display: grid;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 1rem;

  .img-container {
    width: 200px;
    height: 200px;
    .item-span {
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
    .item-img {
      max-height: 100%;
      max-width: 100%;
    }
  }
`;
