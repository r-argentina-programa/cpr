import { useContext, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import styled from 'styled-components';
import CardsList from '../../components/cardsList';
import Header from '../../components/header';
import { BrandContext } from '../../store/brand/brandContext';

const Title = styled.h1`
  margin: 1rem 0;
  text-align: center;
  font-size: 2rem;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 0.2rem;
`;

export default function Brands() {
  const { getAllBrands, brands, error, loading } = useContext(BrandContext);

  useEffect(() => {
    getAllBrands();
  }, []);
  return (
    <>
      <Header />
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" role="status" style={{ margin: '2rem auto', display: 'block' }}>
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <>
          <Title>See all brands Here!</Title>
          <ListContainer className="container-fluid">
            {brands.map((brand) => (
              <CardsList
                item={brand}
                imageSrc={brand.logo.data}
                link={`/brand/${brand.id}`}
                key={brand.id}
              />
            ))}
          </ListContainer>
        </>
      )}
    </>
  );
}
