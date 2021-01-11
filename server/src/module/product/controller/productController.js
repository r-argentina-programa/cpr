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
    const ROUTE = '/product';
    app.get(`${ROUTE}`, this.UploadMiddleware.single('file'), this.save.bind(this));
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
      let newProduct = await this.ProductService.save(productData);
    } catch (error) {
      console.log(error);
    }
  }
};
