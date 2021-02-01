import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { ProductContext } from '../../store/products/productContext';
import SearchContainer from '../search';

const ContainerSearch = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 4px 8px 2px;
  font: 400 13.333px Arial;
  border-radius: 4px;
  outline: 0px;
  padding-left: 5px;

  label {
    display: flex;
    color: #fff;
  }
`;

export default function Header() {
  const [term, setTerm] = useState('');
  const { getProductBySearch, removeProductsBySearch } = useContext(ProductContext);
  const [cart, setCart] = useState([]);
  const history = useHistory();

  useEffect(() => {
    let timerId;
    if (term.trim()) {
      const timer = () =>
        setTimeout(() => {
          getProductBySearch(term);
        }, 500);
      timerId = timer();
    } else {
      removeProductsBySearch();
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [term]);

  let localCart = localStorage.getItem('cart');

  useEffect(() => {
    localCart = JSON.parse(localCart);
    if (localCart) {
      setCart(localCart);
    }
  }, [localCart]);

  return (
    <header>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Navbar.Brand href="/">Market</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link style={{ color: 'hsla(0,0%,100%,0.7)' }} href="/brands">
            Brands
          </Nav.Link>
          <Nav.Link href="/cart" aria-label="Cart">
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
            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#5a7a99',
                width: '21px',
                borderRadius: '80%',
              }}
            >
              <span style={{ color: 'white', textAlign: 'center', display: 'block' }}>
                {cart.length}
              </span>
            </span>
          </Nav.Link>
        </Nav>

        <ContainerSearch>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (term.trim()) {
                removeProductsBySearch();
                setTerm('');
                history.push(`/?search=${term}`);
              }
            }}
          >
            <label htmlFor="Search">
              Search Products:
              <input
                type="text"
                placeholder="Search"
                className="form-control"
                value={term}
                id="Search"
                onChange={(e) => setTerm(e.target.value)}
              />
            </label>
          </form>
          <SearchContainer />
        </ContainerSearch>
      </Navbar>
    </header>
  );
}
