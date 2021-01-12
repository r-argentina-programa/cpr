const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = class ProductModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof ProductModel}
   */
  static setup(sequelizeInstance) {
    ProductModel.init(
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
        defaultPrice: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        imageSrc: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        brand_fk: {
          type: DataTypes.STRING,
        },
        //category_fk TODO
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
        modelName: 'Product',
        underscored: true,
        paranoid: true,
        timestamps: false,
      }
    );

    return ProductModel;
  }
};
