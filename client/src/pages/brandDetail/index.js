import Header from "../../components/header";
import ab2str from "arraybuffer-to-string";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../../store/products/productContext";
import styled from "styled-components";
import CardsList from "../../components/cardsList";

const ListContainer = styled.div`
  display: flex;
  align-items: center;
`;

export default function BrandDetail() {
  const { id } = useParams();
  const [image, setImage] = useState("");
  const { products, getProductsByBrand } = useContext(ProductContext);

  useEffect(() => {
    getProductsByBrand(id);
  }, []);

  return (
    <>
      <Header />
      {!products ? (
        <p>Loading.. Please wait</p>
      ) : (
        <ListContainer className="container-fluid">
          {products.map((product) => (
            <CardsList
              key={product.id}
              item={product}
              imageSrc={product.imageSrc.data}
              link={`/product/${product.id}`}
            />
          ))}
        </ListContainer>
      )}
    </>
  );
}
