const { fromModelToEntity } = require('../mapper/mapper');

module.exports = class ProductRepository {
  /**
   * @param  {import("../model/productModel")} productModel
   */
  constructor(productModel) {
    this.productModel = productModel;
  }

  async save(product) {
    const newProduct = await this.productModel.create(product);
    return fromModelToEntity(newProduct);
  }
};
