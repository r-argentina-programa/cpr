/* eslint-disable class-methods-use-this */
const { fromDataToEntity } = require('../mapper/adminMapper');
const { calculateCartPrice } = require('../utils/calculateCartPrice');

module.exports = class ManagementController {
  /**
   * @param  {import("../../brand/service/brandService")} brandService
   * @param  {import("../../category/service/categoryService"} categoryService
   * @param  {import("../../product/service/productService"} productService
   */
  constructor(brandService, categoryService, productService) {
    this.ROUTE_BASE = '/api';
    this.ADMIN_ROUTE = '/admin';
    this.MANAGEMENT_VIEW_DIR = 'management/view';
    this.brandService = brandService;
    this.categoryService = categoryService;
    this.productService = productService;
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
    app.get(`${ROUTE}/products/all`, this.allProducts.bind(this));
    app.get(`${ROUTE}/product/:id`, this.product.bind(this));
    app.get(`${ROUTE}/search/:term`, this.search.bind(this));
    app.get(`${ROUTE}/brand/:id/viewProducts`, this.viewProductsByBrand.bind(this));
    app.get(`${ROUTE}/category/:id/viewProducts`, this.viewProductsByCategory.bind(this));
    app.get(
      `${ROUTE}/products/all/:brandsIds/:categoriesIds`,
      this.getAllByCategoryAndBrand.bind(this)
    );
    app.get(`${ROUTE}/getCartPrice/:productsId/:productsAmount`, this.getCartPrice.bind(this));
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async viewProductsByBrand(req, res) {
    const { id } = req.params;
    try {
      const products = await this.brandService.viewProducts(id);
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
      const products = await this.categoryService.viewProducts(id);
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
      const brands = await this.brandService.getAll();
      res.status(200).json(brands);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async brand(req, res) {
    try {
      const { id } = req.params;
      const brand = await this.brandService.getById(id);
      res.status(200).json(brand);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async allCategories(req, res) {
    try {
      const categories = await this.categoryService.getAll();
      res.status(200).json(categories);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async category(req, res) {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getById(id);
      res.status(200).json(category);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async allProducts(req, res) {
    try {
      const products = await this.productService.getAll();
      res.status(200).json(products);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async product(req, res) {
    try {
      const { id } = req.params;
      const product = await this.productService.getById(id);
      res.status(200).json(product);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async search(req, res) {
    const { term } = req.params;
    const products = await this.productService.getAllProductsSearch(term);
    res.status(200).json(products);
  }

  async getAllByCategoryAndBrand(req, res) {
    try {
      let { brandsIds, categoriesIds } = req.params;
      brandsIds = brandsIds.split(',');
      categoriesIds = categoriesIds.split(',');
      const products = await this.productService.getAllByCategoryAndBrand(categoriesIds, brandsIds);
      res.status(200).json(products);
    } catch (e) {
      res.status(500).send(e);
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
    } catch (error) {
      console.log(error.message);
    }
  }
};
