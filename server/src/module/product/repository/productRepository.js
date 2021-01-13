const { fromModelToEntity } = require('../mapper/mapper');
const Product = require('../entity/entity');

module.exports = class ProductRepository {
  /**
   * @param  {import("../model/productModel")} productModel
   */
  constructor(productModel) {
    this.productModel = productModel;
  }

  async save(product) {
    if (!(product instanceof Product)) {
      throw new Error('Product not Defined');
    }
    let productModel;

    const buildOptions = { isNewRecord: !product.id };
    productModel = this.productModel.build(product, buildOptions);
    productModel = await productModel.save();

    return fromModelToEntity(productModel);
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
    if (!product) {
      throw new Error('Product Not Found');
    }
    return this.productModel.destroy({ where: { id: product.id } });
  }

  async getAll() {
    const productsInstance = await this.productModel.findAll();
    return productsInstance.map((product) => fromModelToEntity(product));
  }
};
