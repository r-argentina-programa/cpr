const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = class BrandModel extends Model {
  /**
   * @param {import('sequelize').Sequelize} sequelizeInstance
   * @returns {typeof BrandModel}
   */
  static setup(sequelizeInstance) {
    BrandModel.init(
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
        logo: {
          type: DataTypes.BLOB,
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
        modelName: 'Brand',
        tableName: 'brands',
        underscored: true,
        paranoid: true,
        timestamps: false,
      }
    );

    return BrandModel;
  }

  static setupAssociation(ProductModel, DiscountModel) {
    BrandModel.hasMany(ProductModel, {
      foreignKey: 'brandFk',
      as: 'getBrand',
    });
    BrandModel.belongsToMany(DiscountModel, {
      through: 'discount_brand',
      foreignKey: 'brand_id',
      as: 'discounts',
    });

    return BrandModel;
  }
};
