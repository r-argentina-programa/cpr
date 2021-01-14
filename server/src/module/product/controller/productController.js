const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const { fromDataToEntity } = require('../mapper/mapper');

module.exports = class ProductController {
  /**
   * @param  {import("../service/productService")} ProductService
   */
  constructor(ProductService, UploadMiddleware, BrandService) {
    this.ROUTE_BASE = '/admin/product';
    this.ProductService = ProductService;
    this.UploadMiddleware = UploadMiddleware;
    this.BrandService = BrandService;
    this.PRODUCT_VIEWS = 'product/view';
  }

  /**
   * @param  {import("express".Application)} app
   */
  configureRoutes(app) {
    const ROUTE = this.ROUTE_BASE;
    app.post(`${ROUTE}/save`, this.UploadMiddleware.single('file'), this.save.bind(this));
    app.get(`${ROUTE}/delete/:id`, this.delete.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.edit.bind(this));
    app.get(`${ROUTE}/`, this.index.bind(this));
    app.get(`${ROUTE}/create`, this.create.bind(this));
  }

  /**
   * @param  {import("express".Request)} req
   * @param  {import("express").Response} res
   */
  async index(req, res) {
    const productsList = await this.ProductService.getAll();
    const { errors, messages } = req.session;
    res.render(`${this.PRODUCT_VIEWS}/index.njk`, {
      productsList,
      messages,
      errors,
    });
    req.session.errors = [];
    req.session.messages = [];
  }

  /**
   * @param  {import("express".Request)} req
   * @param  {import("express").Response} res
   */
  async save(req, res) {
    const { path } = req.file;
    try {
      const product = fromDataToEntity(req.body);
      product.imageSrc = path;
      const savedProduct = await this.ProductService.save(product);

      if (product.id) {
        req.session.messages = [
          `The product with id ${savedProduct.id} was updated correctly (${savedProduct.name})`,
        ];
      } else {
        req.session.messages = [
          `The product with id ${savedProduct.id} was created correctly (${savedProduct.name})`,
        ];
      }
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }

  /**
   * @param  {import("express").Request} req
   * @param  {import("express").Response} res
   */
  async edit(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new ProductIdNotDefinedError();
    }
    try {
      const product = await this.ProductService.getById(id);
      const brands = await this.BrandService.getAll();
      res.render(`${this.PRODUCT_VIEWS}/form.njk`, {
        product,
        brands,
      });
    } catch (e) {
      req.session.errors = [e.message, e.stack];
      res.redirect(this.ROUTE_BASE);
    }
  }

  /**
   * @param  {import("express").Request} req
   * @param  {import("express").Response} res
   */
  async delete(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new ProductIdNotDefinedError();
    }
    try {
      const product = await this.ProductService.getById(id);
      await this.ProductService.delete(product);
      req.session.messages = [`The product with ID: ${id} was removed (${product.name})`];
    } catch (e) {
      req.session.errors = [e.message, e.stack];
    }
    res.redirect(this.ROUTE_BASE);
  }

  async create(req, res) {
    const brands = await this.BrandService.getAll();
    res.render(`${this.PRODUCT_VIEWS}/form.njk`, { brands });
  }
};
