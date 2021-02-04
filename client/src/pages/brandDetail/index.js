/* eslint-disable no-unused-vars */
import ab2str from 'arraybuffer-to-string';
import { useContext, useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import Alert from 'react-bootstrap/Alert';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import englishString from 'react-timeago/lib/language-strings/en';
import { BrandContext } from '../../store/brand/brandContext';
import { ProductContext } from '../../store/products/productContext';
import Header from '../../components/header';

import {
  Container,
  ImageContainer,
  BrandDescription,
  RightColumnContainer,
  TimeStyle,
  ProductsContainer,
  ListContainer,
} from './styles';
import CardsList from '../../components/cardsList';

const formatter = buildFormatter(englishString);

export default function BrandDetail() {
  const { id } = useParams();
  const [image, setImage] = useState('');
  const { products, getProductsByBrand, loading: loadingProduct } = useContext(ProductContext);
  const { getBrandById, brand, loading: loadingBrand, error } = useContext(BrandContext);

  useEffect(() => {
    document.title = `Smarket - ${brand.name} - Detail page`;
  }, [brand]);

  useEffect(() => {
    getProductsByBrand(id);
    getBrandById(id);
  }, [id]);

  useEffect(() => {
    let uint8;
    if (brand.logo) {
      uint8 = new Uint8Array(brand.logo.data);
    }
    setImage(ab2str(uint8));
  }, [brand.logo]);
  return (
    <>
      <Header />
      {error && <Alert variant="danger">{error}</Alert>}
      {loadingProduct || loadingBrand ? (
        <Spinner animation="border" role="status" style={{ margin: '2rem auto', display: 'block' }}>
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        brand.name && (
          <>
            <Container>
              <ImageContainer>
                <img src={`data:image/png;base64, ${image}`} alt="Product" />
              </ImageContainer>

              <RightColumnContainer>
                <BrandDescription>
                  <h1>{brand.name}</h1>
                  <TimeStyle>
                    <p>
                      Created:
                      <TimeAgo date={`${brand.createdAt}`} formatter={formatter} />
                    </p>
                    <p>
                      Last Update:
                      <TimeAgo date={`${brand.updatedAt}`} formatter={formatter} />
                    </p>
                  </TimeStyle>
                </BrandDescription>
              </RightColumnContainer>
            </Container>
            <ProductsContainer>
              <p>View more products from {brand.name}</p>

              <ListContainer>
                {products.map((product) => (
                  <CardsList
                    key={product.id}
                    item={product}
                    imageSrc={product.imageSrc.data}
                    link={`/product/${product.id}`}
                  />
                ))}
              </ListContainer>
            </ProductsContainer>
          </>
        )
      )}
    </>
  );
}
