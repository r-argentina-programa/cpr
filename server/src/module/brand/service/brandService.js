const BrandIdNotDefinedError = require('../error/BrandIdNotDefinedError');

module.exports = class BrandService {
  /**
   * @param {import('../repository/brandRepository')} BrandRepository
   */
  constructor(BrandRepository) {
    this.BrandRepository = BrandRepository;
  }

  /**
   * @param {import('../entity/Brand')} brand
   */
  async save(brand) {
    if (!(brand instanceof Brand)) {
      throw new BrandNotDefinedError();
    }
    return this.BrandRepository.save(brand);
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
};
