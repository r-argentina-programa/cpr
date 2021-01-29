const { fromModelToEntity } = require('../mapper/brandMapper');
const {
  fromModelToEntity: fromModelToProductEntity,
} = require('../../product/mapper/productMapper');
const BrandNotDefinedError = require('../error/BrandNotDefinedError');
const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');
const BrandNotFoundError = require('../error/BrandNotFoundError');
const Brand = require('../entity/Brand');

module.exports = class BrandRepository {
  /**
   * @param {typeof import('../model/brandModel')} brandModel
   * @param {typeof import('../../product/model/productModel')} ProductModel
   * @param {typeof import('../../category/model/categoryModel')} categoryModel
   * @param {typeof import('../../discount/model/discountModel')} discountModel
   */
  constructor(brandModel, productModel, categoryModel, discountModel) {
    this.brandModel = brandModel;
    this.productModel = productModel;
    this.categoryModel = categoryModel;
    this.discountModel = discountModel;
  }

  /**
   * @param {Brand} brand
   * @param {Array} discountsIds
   */
  async save(brand, discountsIds = []) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }

    let brandModel;
    const buildOptions = { isNewRecord: !brand.id };
    brandModel = this.brandModel.build(brand, buildOptions);
    brandModel = await brandModel.save();

    if (!buildOptions.isNewRecord) {
      const currentDiscounts = await brandModel.getDiscounts();
      const discountsId = currentDiscounts.map((discount) => discount.id);
      await brandModel.removeDiscount(discountsId);
    }

    discountsIds.map(async (id) => {
      await brandModel.addDiscount(id);
    });

    return fromModelToEntity(brandModel);
  }

  /**
   * @param {Brand} brand
   * @returns {Boolean}
   */
  async delete(brand) {
    if (!brand || !brand.id) {
      throw new BrandIdNotDefinedError('El ID de la marca no está definido');
    }

    return Boolean(await this.brandModel.destroy({ where: { id: brand.id } }));
  }

  async getAll() {
    const brandInstances = await this.brandModel.findAll({
      include: {
        model: this.discountModel,
        as: 'discounts',
      },
    });

    return brandInstances.map(fromModelToEntity);
  }

  /**
   * @param {number} brandId
   */
  async getById(brandId) {
    if (!Number(brandId)) {
      throw new BrandIdNotDefinedError();
    }
    const brandInstance = await this.brandModel.findByPk(brandId, {
      include: {
        model: this.discountModel,
        as: 'discounts',
      },
    });
    if (!brandInstance) {
      throw new BrandNotFoundError(`There is no existing brand with ID ${brandId}`);
    }

    return fromModelToEntity(brandInstance);
  }

  /**
   * @param {number} brandId
   */
  async viewProducts(brandId) {
    const products = await this.productModel.findAll({
      where: { brand_fk: brandId },
      include: [
        {
          model: this.categoryModel,
          as: 'categories',
          include: {
            model: this.discountModel,
            as: 'discounts',
          },
        },
        {
          model: this.discountModel,
          as: 'discounts',
        },
      ],
    });
    return products.map((product) => {
      if (Array.isArray(product.categories)) {
        product.categories.forEach((category) => {
          product.discounts.push(...category.discounts);
        });
      }
      return fromModelToProductEntity(product);
    });
  }
};
