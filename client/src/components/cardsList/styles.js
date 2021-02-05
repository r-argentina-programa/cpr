import styled from 'styled-components/macro';

export const TimeStyle = styled.span`
  color: #575757;
  font-size: 10px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  display: block;
`;

export const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  .img-container {
    width: 200px;
    margin: 0 auto;
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

    @media (max-width: 700px) {
      align-self: center;
    }
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-gap: 1rem;
    justify-items: center;
    .img-container {
      max-height: 200px;
    }
  }
`;
