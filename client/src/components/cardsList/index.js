/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import englishString from 'react-timeago/lib/language-strings/en';
import { useEffect, useState } from 'react';
import ab2str from 'arraybuffer-to-string';
import { Link } from 'react-router-dom';
import { TimeStyle, Container } from './styles';

const formatter = buildFormatter(englishString);

export default function CardsList({ item, imageSrc, link }) {
  const [image, setImage] = useState('');
  const [isPercentage, setIsPercentage] = useState(false);
  useEffect(() => {
    const uint8 = new Uint8Array(imageSrc);
    setImage(ab2str(uint8));
  }, [imageSrc]);

  useEffect(() => {
    if (item.discount) {
      if (item.discount.type === 'Percentage') {
        setIsPercentage(true);
      }
    }
  }, [item.discount]);

  return (
    <Container>
      <Card className="card">
        <Card.Body>
          <Card.Title style={{ textAlign: 'center' }}>{item.name}</Card.Title>
          <Card.Img
            variant="top"
            src={`data:image/png;base64, ${image}`}
            style={{ height: '9rem', width: '10rem' }}
            alt={item.name}
          />
          {item.defaultPrice ? (
            !item.discount ? (
              <Card.Subtitle
                style={{
                  margin: '.3rem 0',
                  color: '#575757',
                }}
              >
                ${item.defaultPrice}
              </Card.Subtitle>
            ) : (
              <Card.Subtitle
                style={{
                  margin: '.3rem 0',
                  color: '#575757',
                  textDecoration: 'line-through',
                }}
              >
                ${item.defaultPrice}
              </Card.Subtitle>
            )
          ) : null}
          {item.discount ? (
            isPercentage ? (
              <Card.Subtitle style={{ margin: '.3rem 0', color: '#B00000' }}>
                -%
                {item.discount.value}
                <span
                  style={{
                    display: 'block',
                    textAlign: 'right',
                    fontWeight: '800',
                  }}
                >
                  ${item.discount.finalPrice}
                </span>
              </Card.Subtitle>
            ) : (
              <Card.Subtitle style={{ margin: '.3rem 0', color: '#B00000' }}>
                -$
                {item.discount.value}
                <span
                  style={{
                    display: 'block',
                    textAlign: 'right',
                    fontWeight: '800',
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
            <Button
              style={{ width: '100%', backgroundColor: '#0D6572', borderColor: '#0D6572' }}
              variant="info"
            >
              See Details
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </Container>
  );
}
