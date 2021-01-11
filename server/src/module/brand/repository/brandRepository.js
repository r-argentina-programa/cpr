const { fromModelToEntity } = require('../mapper/brandMapper');
const BrandNotDefinedError = require('../error/BrandNotDefinedError');
const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');
const BrandNotFoundError = require('../error/BrandNotFoundError');
const Brand = require('../entity/Brand');
const ProductModel = require('../../product/model/productModel');

module.exports = class BrandRepository {
  /**
   * @param {typeof import('../model/brandModel')} brandModel
   */
  constructor(brandModel) {
    this.brandModel = brandModel;
  }

  /**
   * @param {import(Brand)} brand
   */
  async save(brand) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }

    const brandInstance = this.brandModel.build(brand, {
      isNewRecord: !brand.id,
    });
    await brandInstance.save();
    return fromModelToEntity(brandInstance);
  }

  async getAll() {
    const brandInstances = await this.brandModel.findAll();
    return brandInstances.map(fromModelToEntity);
  }

  /**
   * @param {number} brandId
   */
  async getById(brandId) {
    if (!Number(brandId)) {
      throw new BrandIdNotDefinedError();
    }
    const brandInstance = await this.brandModel.findByPk(brandId, { include: ProductModel });
    if (!brandInstance) {
      throw new BrandNotFoundError(`There is no existing brand with ID ${brandId}`);
    }

    return fromModelToEntity(brandInstance);
  }
};
