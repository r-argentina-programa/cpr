import Header from "../../components/header";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import ab2str from "arraybuffer-to-string";
import { ProductContext } from "../../store/products/productContext";

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
  return (
    <>
      <Header />
      {!product ? (
        <p>Loading.. Please wait</p>
      ) : (
        <div className="container-fluid">
          <Card className=" text-black">
            <Card.Img
              src={`data:image/png;base64, ${image}`}
              alt="Card image"
              style={{ width: "30%", height: "10rem", alignSelf: "center" }}
            />
            <Card.Title className="text-center">{product.name}</Card.Title>
            <Card.Text className="text-center">{product.description}</Card.Text>
            <Card.Text className="text-center">
              ${product.defaultPrice}
            </Card.Text>
          </Card>
        </div>
      )}
    </>
  );
}
