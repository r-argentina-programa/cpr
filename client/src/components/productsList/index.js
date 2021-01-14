import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function ProductsList({ product }) {
  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={product.logo} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Button variant="info">See Details</Button>
        </Card.Body>
      </Card>
    </>
  );
}
