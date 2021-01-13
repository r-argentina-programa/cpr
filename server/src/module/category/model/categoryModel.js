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
        modelName: 'Category',
        underscored: true,
        paranoid: true,
        timestamps: false,
      }
    );

    return CategoryModel;
  }

  static setupAssociation(ProductModel) {
    CategoryModel.belongsToMany(ProductModel, { through: 'category_products' });
  }
};
