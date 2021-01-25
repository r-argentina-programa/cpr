import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Brands from '../pages/brands';
import Main from '../pages/main';
import ProductDetail from '../pages/productDetail';
import BrandDetail from '../pages/brandDetail/index';
import Cart from '../pages/cart';

export default function Routes() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/brands" component={Brands} />
          <Route path="/brand/:id" component={BrandDetail} />
          <Route path="/cart" component={Cart} />
        </Switch>
      </Router>
    </>
  );
}
