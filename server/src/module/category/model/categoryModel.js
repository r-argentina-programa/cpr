const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = class CategoryModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof CategoryModel}
   */
  static setup(sequelizeInstance) {
    CategoryModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Category',
        underscored: true,
        paranoid: true,
        timestamps: true,
        tableName: 'categories',
      }
    );

    return CategoryModel;
  }

  static setupAssociation(ProductModel, DiscountModel) {
    CategoryModel.belongsToMany(ProductModel, {
      through: 'category_products',
      foreignKey: 'category_id',
      as: 'products',
    });
    CategoryModel.belongsToMany(DiscountModel, {
      through: 'discount_category',
      foreignKey: 'category_id',
      as: 'discounts',
    });

    return CategoryModel;
  }
};
