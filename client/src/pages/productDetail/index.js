import Header from "../../components/header";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import ab2str from "arraybuffer-to-string";
import { ProductContext } from "../../store/products/productContext";
import {
  Container,
  ImageContainer,
  ProductDescription,
  RightColumnContainer,
  ProductPrice,
} from "./styles";
export default function ProductDetail() {
  const { id } = useParams();
  const [image, setImage] = useState("");
  const { product, getProductDetails } = useContext(ProductContext);

  useEffect(() => {
    getProductDetails(id);
  }, []);

  useEffect(() => {
    let uint8;
    if (product.imageSrc) {
      uint8 = new Uint8Array(product.imageSrc.data);
    }
    setImage(ab2str(uint8));
  }, [product]);

  console.log(product);
  return (
    <>
      <Header />
      {!product ? (
        <p>Loading.. Please wait</p>
      ) : (
        <Container>
          <ImageContainer>
            <img src={`data:image/png;base64, ${image}`} />
          </ImageContainer>

          <RightColumnContainer>
            <ProductDescription>
              {product.categories &&
                product.categories.map((category) => (
                  <span>{category.name}</span>
                ))}
              <h1>{product.name}</h1>
              <p>{product.description}</p>
            </ProductDescription>

            <ProductPrice>
              {product.discount ? (
                <>
                  <span style={{ textDecoration: "line-through" }}>
                    ${product.defaultPrice}
                  </span>
                  <span
                    style={{
                      color: "red",
                      border: "1px solid red",
                      padding: ".4rem",
                    }}
                  >
                    ${product.discount.finalPrice}
                  </span>
                </>
              ) : (
                <span>${product.defaultPrice}</span>
              )}
              <br />
              <a href="#">Add to Cart</a>
            </ProductPrice>
          </RightColumnContainer>
        </Container>
      )}
    </>
  );
}
