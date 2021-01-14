import styled from "styled-components";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import TimeAgo from "react-timeago";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import englishString from "react-timeago/lib/language-strings/en";

const formatter = buildFormatter(englishString);

const TimeStyle = styled.span`
  color: #999999;
  font-size: 10px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
`;

export default function ProductsList({ product }) {
  return (
    <>
      <Card style={{ width: "15rem", height: "10rem" }}>
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Img variant="top" src={product.imageSrc} />
          <TimeStyle>
            <TimeAgo date={`${product.createdAt}`} formatter={formatter} />
            <br />
          </TimeStyle>
          <Button variant="info">See Details</Button>
        </Card.Body>
      </Card>
    </>
  );
}
