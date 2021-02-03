const BrandModel = require('../../module/brand/model/brandModel');
const CategoryModel = require('../../module/category/model/categoryModel');
const ProductModel = require('../../module/product/model/productModel');
const DiscountModel = require('../../module/discount/model/discountModel');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /** @param {import('sequelize').queryInterface} queryInterface */
    return Promise.all([
      ProductModel.setup(queryInterface.sequelize),
      CategoryModel.setup(queryInterface.sequelize),
      BrandModel.setup(queryInterface.sequelize),
      DiscountModel.setup(queryInterface.sequelize),

      ProductModel.setupAssociation(CategoryModel, BrandModel, DiscountModel),
      CategoryModel.setupAssociation(ProductModel, DiscountModel),
      BrandModel.setupAssociation(ProductModel, DiscountModel),
      DiscountModel.setupAssociation(ProductModel, CategoryModel, BrandModel),

      BrandModel.sync(),
      CategoryModel.sync(),
      ProductModel.sync(),
      DiscountModel.sync(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /** @param {import('sequelize').queryInterface} queryInterface */
    await queryInterface.dropTable('products', { cascade: true });
    await queryInterface.dropTable('categories', { cascade: true });
    await queryInterface.dropTable('brands', { cascade: true });
    await queryInterface.dropTable('discounts', { cascade: true });

    await queryInterface.dropTable('category_products', { cascade: true });
    await queryInterface.dropTable('discount_brand', { cascade: true });
    await queryInterface.dropTable('discount_category', { cascade: true });
    await queryInterface.dropTable('discount_products', { cascade: true });
  },
};
