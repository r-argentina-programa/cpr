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

  async getById(id) {
    if (!id) {
      throw new Error('Id not defined');
    }
    const productInstance = await this.productModel.findByPk(id);
    if (!productInstance) {
      throw new Error(`Product with ID ${id} was not found`);
    }
    return fromModelToEntity(productInstance);
  }

  async delete(product) {
    return this.productModel.destroy({ where: { id: product.id } });
  }

  async getAll() {
    const productsInstance = await this.productModel.findAll();
    return productsInstance.map((product) => fromModelToEntity(product));
  }
};
