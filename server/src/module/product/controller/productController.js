const { fromDataToEntity } = require('../mapper/mapper');

module.exports = class ProductController {
  /**
   * @param  {import("../service/productService")} ProductService
   */
  constructor(ProductService, UploadMiddleware, BrandService) {
    this.ProductService = ProductService;
    this.UploadMiddleware = UploadMiddleware;
    this.BrandService = BrandService;
    this.PRODUCT_VIEWS = 'product/view';
  }

  /**
   * @param  {import("express".Application)} app
   */
  configureRoutes(app) {
    const ROUTE = '/admin/product';
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
    res.render(`${this.PRODUCT_VIEWS}/index.njk`, {
      productsList,
    });
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
      await this.ProductService.save(product);
      res.redirect('/admin/product');
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @param  {import("express").Request} req
   * @param  {import("express").Response} res
   */
  async edit(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new Error('Product ID not defined');
    }
    try {
      const product = await this.ProductService.getById(id);
      res.render(`${this.PRODUCT_VIEWS}/form.njk`, {
        product,
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @param  {import("express").Request} req
   * @param  {import("express").Response} res
   */
  async delete(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      throw new Error('Product ID not defined');
    }
    try {
      const product = await this.ProductService.getById(id);
      await this.ProductService.delete(product);
      res.redirect('/admin/product');
    } catch (error) {
      console.log(error);
    }
  }

  async create(req, res) {
    const brands = await this.BrandService.getAll();
    res.render(`${this.PRODUCT_VIEWS}/form.njk`, { brands });
  }
};
