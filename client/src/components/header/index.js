import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import SearchContainer from '../search';
import { ProductContext } from '../../store/products/productContext';

const ContainerSearch = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 4px 8px 2px;
  font: 400 13.333px Arial;
  border-radius: 4px;
  outline: 0px;
  padding-left: 5px;
`;

export default function Header() {
  const [term, setTerm] = useState('');
  const { getProductBySearch } = useContext(ProductContext);
  let time = null;

  useEffect(() => {
    clearTimeout(time);
    if (term.trim()) {
      // eslint-disable-next-line
      time = setTimeout(() => {
        getProductBySearch(term);
      }, 2000);
    }
  }, [term]);

  return (
    <header>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Navbar.Brand href="/">Market</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/brands">Brands</Nav.Link>
        </Nav>

        <ContainerSearch>
          <Form inline>
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            {term.length > 0 && <SearchContainer />}
          </Form>
        </ContainerSearch>
      </Navbar>
    </header>
  );
}
