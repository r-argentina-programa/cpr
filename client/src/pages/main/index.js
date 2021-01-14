import { useEffect } from "react";
import Header from "../../components/header";
import { useProducts } from "../../hooks/products";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
export default function Main() {
  const { products, setProducts, getAllProducts } = useProducts();

  useEffect(() => {
    getAllProducts();
  }, []);
  console.log(products);
  return (
    <>
      <Header />
      {products.map((product) => (
        <Card style={{ width: "18rem" }}>
          <Card.Img variant="top" src={product.imageSrc} />
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>{product.description}</Card.Text>
            <Button variant="primary">See Details</Button>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}
