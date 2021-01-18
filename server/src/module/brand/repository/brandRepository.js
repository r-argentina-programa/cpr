const { fromModelToEntity } = require('../mapper/brandMapper');
const { fromModelToEntity: fromModelToProductEntity } = require('../../product/mapper/mapper');
const BrandNotDefinedError = require('../error/BrandNotDefinedError');
const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');
const BrandNotFoundError = require('../error/BrandNotFoundError');
const Brand = require('../entity/Brand');

module.exports = class BrandRepository {
  /**
   * @param {typeof import('../model/BrandModel')} BrandModel
   * @param {typeof import('../../product/model/productModel')} ProductModel
   */
  constructor(BrandModel, ProductModel) {
    this.BrandModel = BrandModel;
    this.ProductModel = ProductModel;
  }

  /**
   * @param {import(Brand)} brand
   */
  async save(brand) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }

    const brandInstance = this.BrandModel.build(brand, {
      isNewRecord: !brand.id,
    });
    await brandInstance.save();
    return fromModelToEntity(brandInstance);
  }

  /**
   * @param {Brand} brand
   * @returns {Boolean}
   */
  async delete(brand) {
    if (!brand || !brand.id) {
      throw new BrandIdNotDefinedError('El ID de la marca no está definido');
    }

    return Boolean(await this.BrandModel.destroy({ where: { id: brand.id } }));
  }

  async getAll() {
    const brandInstances = await this.BrandModel.findAll();
    return brandInstances.map(fromModelToEntity);
  }

  /**
   * @param {number} brandId
   */
  async getById(brandId) {
    if (!Number(brandId)) {
      throw new BrandIdNotDefinedError();
    }
    //const brandInstance = await this.BrandModel.findByPk(brandId, { include: ProductModel });
    const brandInstance = await this.BrandModel.findByPk(brandId);
    if (!brandInstance) {
      throw new BrandNotFoundError(`There is no existing brand with ID ${brandId}`);
    }

    return fromModelToEntity(brandInstance);
  }

  async viewProducts(brandId) {
    const products = await this.ProductModel.findAll({ where: { brand_fk: brandId } });
    return products.map((product) => fromModelToProductEntity(product));
  }
};
