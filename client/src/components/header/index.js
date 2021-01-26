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
          <Nav.Link href="/cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-cart"
              viewBox="0 0 16 16"
              color="aliceblue"
            >
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
          </Nav.Link>
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
