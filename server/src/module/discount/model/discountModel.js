const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = class DiscountModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof DiscountModel}
   */
  static setup(sequelizeInstance) {
    DiscountModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        value: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Discount',
        underscored: true,
        paranoid: true,
        timestamps: true,
        tableName: 'discounts',
      }
    );

    return DiscountModel;
  }

  static setupAssociation(ProductModel, CategoryModel, BrandModel) {
    DiscountModel.belongsToMany(ProductModel, {
      through: 'discount_products',
      as: 'products',
    });
    DiscountModel.belongsToMany(CategoryModel, {
      through: 'discount_category',
      as: 'categories',
    });
    DiscountModel.belongsToMany(BrandModel, {
      through: 'discount_brand',
      as: 'brands',
    });

    return DiscountModel;
  }
};
