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
        modelName: 'Discount',
        underscored: true,
        paranoid: true,
        timestamps: false,
      }
    );

    return DiscountModel;
  }

  static setupAssociation(ProductModel) {
    DiscountModel.belongsToMany(ProductModel, { through: 'discount_products' });
  }
};
