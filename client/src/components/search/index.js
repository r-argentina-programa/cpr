import styled from "styled-components/macro";
import ab2str from "arraybuffer-to-string";
import { Link } from "react-router-dom";

const Container = styled.div`
  &::before {
    content: "";
    width: 15px;
    height: 15px;
    transform: rotate(45deg);
    background: #fff;
    border: 1px solid #e6e6e6;
    position: absolute;
    top: -9px;
    right: 50%;
  }
  &::after {
    content: "";
    width: 30px;
    height: 15px;
    background: red;
    position: absolute;
    background: #fff;
    top: 0px;
    right: 48%;
    z-index: 0;
  }
  position: absolute;
  top: 50px;
  background: #fff;
  left: -50px;
  width: 300px;
  height: 280px;
  border-radius: 5px;
  border: 1px solid #e6e6e6;
  z-index: 2;
`;

const ContainerResults = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: flex-start;
  align-items: flex-start;
  overflow: auto;
  width: 100%;
  height: 100%;
`;

const ContainerProduct = styled.div`
  width: 100%;
  display: flex;
  padding: 12px 12px;
  z-index: 1;
  border-bottom: 1px solid #e6e6e6;
  cursor: pointer;
  text-decoration: none;

  span {
    color: #2c2c2c;
    letter-spacing: 0.4px;
  }
  img {
    height: 8rem;
  }
`;
export default function SearchContainer() {
  const products = [];
  return (
    <Container>
      <ContainerResults>
        {products.length > 0 ? (
          products.map((product) => (
            <ContainerProduct>
              <Link to={`/product/${product.id}`}>
                <span>{product.name}</span>{" "}
                <img
                  src={`data:image/png;base64, ${ab2str(
                    new Uint8Array(product.imageSrc.data)
                  )}`}
                  alt="img"
                />
              </Link>
            </ContainerProduct>
          ))
        ) : (
          <p>No products found</p>
        )}
      </ContainerResults>
    </Container>
  );
}
