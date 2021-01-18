import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { useSearch } from "../../hooks/search";
import { useEffect, useState } from "react";
import SearchContainer from "../search";

export default function Header() {
  const { getSearchData, setProducts } = useSearch();
  const [term, setTerm] = useState("");
  let time = null;

  useEffect(() => {
    clearTimeout(time);
    if (term.trim()) {
      // eslint-disable-next-line
      time = setTimeout(() => {
        getSearchData(term);
      }, 2000);
    }
    return () => {
      setProducts([]);
    };
  }, [term]);

  return (
    <header>
      <Navbar bg="dark" variant="dark" sticky="top">
        <Navbar.Brand href="/">Market</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/brands">Brands</Nav.Link>
          <Nav.Link href="/categories">Categories</Nav.Link>
        </Nav>

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
      </Navbar>
    </header>
  );
}
