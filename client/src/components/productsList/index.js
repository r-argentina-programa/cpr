import styled from "styled-components";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import TimeAgo from "react-timeago";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import englishString from "react-timeago/lib/language-strings/en";
import { useEffect, useState } from "react";
import ab2str from "arraybuffer-to-string";

const formatter = buildFormatter(englishString);

const TimeStyle = styled.span`
  color: #999999;
  font-size: 10px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
`;

export default function ProductsList({ product }) {
  const [image, setImage] = useState("");
  useEffect(() => {
    const uint8 = new Uint8Array(product.imageSrc.data);
    setImage(ab2str(uint8));
  }, [product.imageSrc.data]);

  return (
    <>
      <Card style={{ width: "15rem", height: "10rem" }}>
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Img variant="top" src={`data:image/png;base64, ${image}`} />
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