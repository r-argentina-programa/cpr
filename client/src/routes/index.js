import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Brands from "../pages/brands";
import Main from "../pages/main/";
import ProductDetail from "../pages/productDetail";
export default function Routes() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/brands" component={Brands} />
          <Route exact path="/product/:id" component={ProductDetail} />
        </Switch>
      </Router>
    </>
  );
}
