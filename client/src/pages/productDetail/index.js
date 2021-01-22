import Header from "../../components/header";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
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
  }, [id]);

  useEffect(() => {
    let uint8;
    if (product.imageSrc) {
      uint8 = new Uint8Array(product.imageSrc.data);
    }
    setImage(ab2str(uint8));
  }, [product]);

  return (
    <>
      <Header />
      {!product.brand ? (
        <p>Loading.. Please wait</p>
      ) : (
        <Container>
          <ImageContainer>
            <img src={`data:image/png;base64, ${image}`} alt="Product" />
          </ImageContainer>

          <RightColumnContainer>
            <ProductDescription>
              {product.categories &&
                product.categories.map((category) => (
                  <span key={category.id}>{category.name}</span>
                ))}
              <h1>{product.name}</h1>
              <p>{product.description}</p>
              <div className="brandContainer">
                <p>
                  Made by
                  <Link to={`/brand/${product.brand.id}`} className="brand">
                    {product.brand.name}
                  </Link>
                </p>
              </div>
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
