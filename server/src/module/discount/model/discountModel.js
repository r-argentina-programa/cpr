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
        fkDiscountType: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        value: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        discountFrom: {
          type: DataTypes.DATE,
          defaultValue: Sequelize.NOW,
        },
        discountTo: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Discount',
        underscored: true,
        paranoid: true,
        timestamps: true,
      }
    );

    return DiscountModel;
  }

  static setupAssociation(DiscountTypeModel) {
    DiscountModel.belongsTo(DiscountTypeModel);
  }
};
