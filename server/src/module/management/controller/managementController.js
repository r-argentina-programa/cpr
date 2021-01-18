const { fromDataToEntity } = require('../mapper/adminMapper');

module.exports = class ManagementController {
  constructor(BrandService, CategoryService, ProductService) {
    this.ROUTE_BASE = '/api';
    this.ADMIN_ROUTE = '/admin';
    this.MANAGEMENT_VIEW_DIR = 'management/view';
    this.BrandService = BrandService;
    this.CategoryService = CategoryService;
    this.ProductService = ProductService;
  }

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
  }

  async loginForm(req, res) {
    const { errors, messages } = req.session;
    res.render(`${this.MANAGEMENT_VIEW_DIR}/login.njk`, { messages, errors });
    req.session.errors = [];
    req.session.messages = [];
  }

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

  async logout(req, res) {
    try {
      req.session.username = [];
      req.session.admin = [];
      req.session.messages = ['Administrator has been logged out'];
      res.redirect(`${this.ADMIN_ROUTE}`);
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect(`${this.ADMIN_ROUTE}`);
    }
  }

  async allBrands(req, res) {
    try {
      const brands = await this.BrandService.getAll();
      res.status(200).json(brands);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async brand(req, res) {
    try {
      const { id } = req.params;
      const brand = await this.BrandService.getById(id);
      res.status(200).json(brand);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async allCategories(req, res) {
    try {
      const categories = await this.CategoryService.getAll();
      res.status(200).json(categories);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async category(req, res) {
    try {
      const { id } = req.params;
      const category = await this.CategoryService.getById(id);
      res.status(200).json(category);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async allProducts(req, res) {
    try {
      const products = await this.ProductService.getAll();
      res.status(200).json(products);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async product(req, res) {
    try {
      const { id } = req.params;
      const product = await this.ProductService.getById(id);
      res.status(200).json(product);
    } catch (e) {
      res.status(500).send(e);
    }
  }
};
