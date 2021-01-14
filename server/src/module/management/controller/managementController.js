module.exports = class ManagementController {
  constructor(BrandService, CategoryService, ProductService) {
    this.ROUTE_BASE = '/api';
    this.BrandService = BrandService;
    this.CategoryService = CategoryService;
    this.ProductService = ProductService;
  }

  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.get(`${ROUTE}/brands/all`, this.allBrands.bind(this));
    app.get(`${ROUTE}/brand/:id`, this.brand.bind(this));
    app.get(`${ROUTE}/categories/all`, this.allCategories.bind(this));
    app.get(`${ROUTE}/category/:id`, this.category.bind(this));
    app.get(`${ROUTE}/products/all`, this.allProducts.bind(this));
    app.get(`${ROUTE}/product/:id`, this.product.bind(this));
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
