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
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.NOW,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Discount',
        underscored: true,
        paranoid: true,
        timestamps: false,
        tableName: 'discounts',
      }
    );

    return DiscountModel;
  }

  static setupAssociation(ProductModel, CategoryModel, BrandModel) {
    DiscountModel.belongsToMany(ProductModel, { through: 'discount_products' });
    DiscountModel.belongsToMany(CategoryModel, { through: 'discount_category' });
    DiscountModel.belongsToMany(BrandModel, { through: 'discount_brand' });

    return DiscountModel;
  }
};
