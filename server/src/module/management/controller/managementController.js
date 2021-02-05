/* eslint-disable eqeqeq */
/* eslint-disable class-methods-use-this */
const { fromDataToEntity } = require('../mapper/adminMapper');
const { calculateCartPrice } = require('../utils/calculateCartPrice');

module.exports = class ManagementController {
  /**
   * @param  {import("../../brand/service/brandService")} BrandService
   * @param  {import("../../category/service/categoryService"} CategoryService
   * @param  {import("../../product/service/productService"} ProductService
   */
  constructor(BrandService, CategoryService, ProductService) {
    this.ROUTE_BASE = '/api';
    this.ADMIN_ROUTE = '/admin';
    this.MANAGEMENT_VIEW_DIR = 'management/view';
    this.BrandService = BrandService;
    this.CategoryService = CategoryService;
    this.ProductService = ProductService;
  }

  /**
   * @param  {import("express".Application)} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;

    app.get(`${this.ADMIN_ROUTE}`, this.loginForm.bind(this));
    app.post(`${this.ADMIN_ROUTE}/login`, this.login.bind(this));
    app.get(`${this.ADMIN_ROUTE}/logout`, this.logout.bind(this));
    app.get(`${ROUTE}/brands/all`, this.allBrands.bind(this));
    app.get(`${ROUTE}/brand/:id`, this.brand.bind(this));
    app.get(`${ROUTE}/categories/all`, this.allCategories.bind(this));
    app.get(`${ROUTE}/category/:id`, this.category.bind(this));
    app.get(`${ROUTE}/products/all/:offset?/:limit?`, this.allProducts.bind(this));
    app.get(`${ROUTE}/product/:id`, this.product.bind(this));
    app.get(`${ROUTE}/search/:term`, this.search.bind(this));
    app.get(`${ROUTE}/brand/:id/viewProducts`, this.viewProductsByBrand.bind(this));
    app.get(`${ROUTE}/category/:id/viewProducts`, this.viewProductsByCategory.bind(this));
    app.get(`${ROUTE}/products/filter`, this.getFilteredProducts.bind(this));
    app.get(`${ROUTE}/products/numberOfProducts`, this.getNumberOfProducts.bind(this));
    app.get(`${ROUTE}/products/relatedProducts`, this.getRelatedProducts.bind(this));
    app.get(`${ROUTE}/getCartPrice/:productsId/:productsAmount`, this.getCartPrice.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async viewProductsByBrand(req, res) {
    const { id } = req.params;
    try {
      const products = await this.BrandService.viewProducts(id);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async viewProductsByCategory(req, res) {
    const { id } = req.params;
    try {
      const products = await this.CategoryService.viewProducts(id);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async loginForm(req, res) {
    if (!(req.session.username === process.env.ADMIN_USERNAME && req.session.admin)) {
      const { errors, messages } = req.session;
      res.render(`${this.MANAGEMENT_VIEW_DIR}/login.njk`, { messages, errors });
      req.session.errors = [];
      req.session.messages = [];
    } else {
      req.session.messages = [`You are already logged in as ${req.session.username}!`];
      res.redirect(`${this.ADMIN_ROUTE}/product`);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async login(req, res) {
    try {
      const admin = fromDataToEntity(req.body);
      if (
        admin.username === process.env.ADMIN_USERNAME &&
        admin.password === process.env.ADMIN_PASSWORD
      ) {
        req.session.username = process.env.ADMIN_USERNAME;
        req.session.admin = true;
        req.session.messages = [
          `Administrator "${process.env.ADMIN_USERNAME}" logged in successfully`,
        ];
        res.redirect(`${this.ADMIN_ROUTE}/product`);
      } else {
        req.session.errors = ['Incorrect username and / or password'];
        res.redirect(`${this.ADMIN_ROUTE}`);
      }
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect(`${this.ADMIN_ROUTE}`);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async logout(req, res) {
    try {
      if (req.session.username === process.env.ADMIN_USERNAME && req.session.admin) {
        req.session.username = [];
        req.session.admin = [];
        req.session.messages = ['Administrator has been logged out'];
        res.redirect(`${this.ADMIN_ROUTE}`);
      } else {
        req.session.messages = ['You cannot log out because you have not logged in'];
        res.redirect(`${this.ADMIN_ROUTE}`);
      }
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect(`${this.ADMIN_ROUTE}`);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async allBrands(req, res) {
    try {
      const brands = await this.BrandService.getAll();
      res.status(200).json(brands);
    } catch (e) {
      res.status(500).send({ error: 'Sorry, an error occurred' });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async brand(req, res) {
    try {
      const { id } = req.params;
      const brand = await this.BrandService.getById(id);
      res.status(200).json(brand);
    } catch (e) {
      res.status(500).send({ error: 'Brand not Found' });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async allCategories(req, res) {
    try {
      const categories = await this.CategoryService.getAll();
      res.status(200).json(categories);
    } catch (e) {
      res.status(500).send({ error: 'Sorry, an error occurred' });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async category(req, res) {
    try {
      const { id } = req.params;
      const category = await this.CategoryService.getById(id);
      res.status(200).json(category);
    } catch (e) {
      res.status(500).send({ error: 'Category not found' });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async allProducts(req, res) {
    try {
      const { offset, limit } = req.params;
      const products = await this.ProductService.getAll(offset, limit);
      res.status(200).json(products);
    } catch (e) {
      res.status(500).send({ error: 'Error Loading Products' });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async product(req, res) {
    try {
      const { id } = req.params;
      const product = await this.ProductService.getById(id);
      res.status(200).json(product);
    } catch (e) {
      res.status(500).send({ error: 'Product Not found' });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async search(req, res) {
    try {
      const { term } = req.params;
      const products = await this.ProductService.getAllProductsSearch(term);
      res.status(200).json(products);
    } catch (e) {
      res.status(500).send({ error: 'Sorry, an error occurred' });
    }
  }

  async getFilteredProducts(req, res) {
    try {
      const { brand, category, priceRange, search, page } = req.query;
      let price;
      if (priceRange) {
        price = priceRange.split('-');
        price[0] = price[0] == false ? 0 : price[0];
        price[1] = price[1] == false ? Infinity : price[1];
      }
      const products = await this.ProductService.getFilteredProducts(
        category,
        brand,
        price,
        page,
        search
      );
      res.status(200).json(products);
    } catch (e) {
      res.status(500).send({ error: 'Sorry, an error occurred' });
    }
  }

  async getNumberOfProducts(req, res) {
    try {
      const { brand, category, priceRange, search } = req.query;
      let price;
      if (priceRange) {
        price = priceRange.split('-');
        price[0] = price[0] == false ? 0 : price[0];
        price[1] = price[1] == false ? Infinity : price[1];
      }
      const numberOfProducts = await this.ProductService.getNumberOfProducts(
        category,
        brand,
        price,
        search
      );
      res.status(200).json(numberOfProducts);
    } catch (e) {
      res.status(500).send({ error: 'Sorry, an error occurred' });
    }
  }

  async getRelatedProducts(req, res) {
    try {
      const { category } = req.query;
      const relatedProducts = await this.ProductService.getRelatedProducts(category);
      res.status(200).json(relatedProducts);
    } catch (e) {
      res.status(500).send({ error: 'Sorry, an error occurred' });
    }
  }

  async getCartPrice(req, res) {
    let { productsId, productsAmount } = req.params;

    productsId = productsId.split(',');
    productsAmount = productsAmount.split(',');

    const productsIdsAndQuantity = [];
    productsId.forEach((id, i) =>
      productsIdsAndQuantity.push({ id: Number(id), quantity: Number(productsAmount[i]) })
    );

    const productIds = productsIdsAndQuantity.map((e) => e.id);
    try {
      const products = await this.ProductService.getByIds(productIds);
      const cartPrice = calculateCartPrice(productsIdsAndQuantity, products);
      res.status(200).json(cartPrice);
    } catch (e) {
      res.status(500).send({ error: 'Sorry, an error occurred' });
    }
  }
};
