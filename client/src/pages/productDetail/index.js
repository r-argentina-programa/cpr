import Header from "../../components/header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import ab2str from "arraybuffer-to-string";

export default function ProductDetail() {
  const { id } = useParams();
  const [image, setImage] = useState("");
  const product = [];
  useEffect(() => {
    let uint8;
    if (product.data) {
      uint8 = new Uint8Array(product.data.imageSrc.data);
    }
    setImage(ab2str(uint8));
  }, [product]);

  const { data } = product;
  return (
    <>
      <Header />
      {!data ? (
        <p>Loading.. Please wait</p>
      ) : (
        <div className="container-fluid">
          <Card className=" text-black">
            <Card.Img
              src={`data:image/png;base64, ${image}`}
              alt="Card image"
              style={{ width: "30%", height: "10rem", alignSelf: "center" }}
            />
            <Card.Title className="text-center">{data.name}</Card.Title>
            <Card.Text className="text-center">{data.description}</Card.Text>
            <Card.Text className="text-center">${data.defaultPrice}</Card.Text>
          </Card>
        </div>
      )}
    </>
  );
}
