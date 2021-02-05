const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');
const BrandNotDefinedError = require('../error/BrandNotDefinedError');
const Brand = require('../entity/Brand');

module.exports = class BrandService {
  /**
   * @param {import('../repository/brandRepository')} brandRepository
   */
  constructor(brandRepository) {
    this.brandRepository = brandRepository;
  }

  /**
   * @param {Brand} brand
   */
  async save(brand, discountsIds) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }
    return this.brandRepository.save(brand, discountsIds);
  }

  /**
   * @param {Brand} brand
   */
  async delete(brand) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }
    return this.brandRepository.delete(brand);
  }

  async getAll(offset, limit) {
    return this.brandRepository.getAll(offset, limit);
  }

  async getAllCount() {
    return this.brandRepository.getAllCount();
  }

  /**
   * @param {string} term
   */
  async getAllBrandsSearch(term) {
    return (await this.brandRepository.getAllBrandsSearch(term)) || [];
  }

  /**
   * @param {number} brandId
   */
  async getById(brandId) {
    if (!Number(brandId)) {
      throw new BrandIdNotDefinedError();
    }
    return this.brandRepository.getById(brandId);
  }

  /**
   * @param {number} brandId
   */
  async viewProducts(brandId) {
    if (!Number(brandId)) {
      throw new BrandIdNotDefinedError();
    }
    return this.brandRepository.viewProducts(brandId);
  }
};
