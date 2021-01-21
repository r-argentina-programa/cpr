import styled from "styled-components";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import TimeAgo from "react-timeago";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import englishString from "react-timeago/lib/language-strings/en";
import { useEffect, useState } from "react";
import ab2str from "arraybuffer-to-string";
import { Link } from "react-router-dom";
const formatter = buildFormatter(englishString);

const TimeStyle = styled.span`
  color: #999999;
  font-size: 10px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
`;

export default function CardsList({ item, imageSrc, link }) {
  const [image, setImage] = useState("");
  const [isPercentage, setIsPercentage] = useState(false);
  useEffect(() => {
    const uint8 = new Uint8Array(imageSrc);
    setImage(ab2str(uint8));
  }, [imageSrc]);

  useEffect(() => {
    if (item.discount) {
      if (item.discount.type === "Percentage") {
        setIsPercentage(true);
      }
    }
  }, [item.discount]);

  return (
    <>
      <Card style={{ width: "15rem", height: "23rem" }}>
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>{item.name}</Card.Title>
          <Card.Img
            variant="top"
            src={`data:image/png;base64, ${image}`}
            style={{ height: "9rem", width: "10rem" }}
          />
          {item.defaultPrice ? (
            item.discount.length === 0 ? (
              <Card.Subtitle
                style={{
                  margin: ".3rem 0",
                  color: "grey",
                }}
              >
                ${item.defaultPrice}
              </Card.Subtitle>
            ) : (
              <Card.Subtitle
                style={{
                  margin: ".3rem 0",
                  color: "grey",
                  textDecoration: "line-through",
                }}
              >
                ${item.defaultPrice}
              </Card.Subtitle>
            )
          ) : null}
          {item.discount ? (
            isPercentage ? (
              <Card.Subtitle style={{ margin: ".3rem 0", color: "red" }}>
                -%{item.discount.value}
                <span
                  style={{
                    display: "block",
                    textAlign: "right",
                    fontWeight: "800",
                  }}
                >
                  ${item.discount.finalPrice}
                </span>
              </Card.Subtitle>
            ) : (
              <Card.Subtitle style={{ margin: ".3rem 0", color: "red" }}>
                -${item.discount.value}
                <span
                  style={{
                    display: "block",
                    textAlign: "right",
                    fontWeight: "800",
                  }}
                >
                  ${item.discount.finalPrice}
                </span>
              </Card.Subtitle>
            )
          ) : null}
          <TimeStyle>
            <TimeAgo date={`${item.createdAt}`} formatter={formatter} />
            <br />
          </TimeStyle>
          <Link to={link}>
            <Button style={{ width: "100%" }} variant="info">
              See Details
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </>
  );
}
