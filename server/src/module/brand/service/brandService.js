const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');
const BrandNotDefinedError = require('../error/BrandNotDefinedError');
const Brand = require('../entity/Brand');

module.exports = class BrandService {
  /**
   * @param {import('../repository/brandRepository')} BrandRepository
   */
  constructor(BrandRepository) {
    this.BrandRepository = BrandRepository;
  }

  /**
   * @param {Brand} brand
   */
  async save(brand, discountsIds) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }
    console.log(discountsIds)
    return this.BrandRepository.save(brand, discountsIds);
  }

  /**
   * @param {Brand} brand
   */
  async delete(brand) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }

    return this.BrandRepository.delete(brand);
  }

  async getAll() {
    return this.BrandRepository.getAll();
  }

  /**
   * @param {number} brandId
   */
  async getById(brandId) {
    if (!Number(brandId)) {
      throw new BrandIdNotDefinedError();
    }
    return this.BrandRepository.getById(brandId);
  }

  /**
   * @param {number} brandId
   */
  async viewProducts(brandId) {
    if (!Number(brandId)) {
      throw new BrandIdNotDefinedError();
    }
    return this.BrandRepository.viewProducts(brandId);
  }
};
