const { fromDataToEntity } = require('../mapper/mapper');

module.exports = class ProductController {
  /**
   * @param  {import("../service/productService")} ProductService
   */
  constructor(ProductService, UploadMiddleware) {
    this.ProductService = ProductService;
    this.UploadMiddleware = UploadMiddleware;
  }

  /**
   * @param  {import("express".Application)} app
   */
  configureRoutes(app) {
    const ROUTE = '/admin/product';
    app.post(`${ROUTE}/save`, this.UploadMiddleware.single('file'), this.save.bind(this));
    app.post(`${ROUTE}/delete/:id`, this.delete.bind(this));
    app.get(`${ROUTE}/edit/:id`, this.edit.bind(this));
  }

  /**
   * @param  {import("express".Request)} req
   * @param  {import("express").Response} res
   */
  async save(req, res) {
    const { filename } = req.file;
    const { name, defaultPrice, description } = req.body;

    const productImageURL = `${process.env.APP_URL}/files/${filename}`;
    try {
      const productData = fromDataToEntity({
        name,
        defaultPrice,
        description,
        imageSrc: productImageURL,
      });
      await this.ProductService.save(productData);
      res.redirect('product/view/index.njk');
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
    } catch (error) {
      console.log(error);
    }
  }
};

// getAll
