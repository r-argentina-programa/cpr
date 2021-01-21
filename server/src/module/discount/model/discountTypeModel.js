const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = class DiscountTypeModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof DiscountTypeModel}
   */
  static setup(sequelizeInstance) {
    DiscountTypeModel.init(
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
        modelName: 'DiscountType',
        underscored: true,
        paranoid: true,
        timestamps: false,
      }
    );

    return DiscountTypeModel;
  }

  static setupAssociation(DiscountModel) {
    DiscountTypeModel.hasMany(DiscountModel, {
      foreignKey: 'fk_discount_type',
      as: 'getType',
    });
  }
};
