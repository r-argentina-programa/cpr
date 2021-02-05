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
          type: DataTypes.BLOB,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        brandFk: {
          type: DataTypes.INTEGER,
          references: {
            model: { tableName: 'brands' },
            key: 'id',
          },
        },
      },
      {
        sequelize: sequelizeInstance,
        modelName: 'Product',
        underscored: true,
        paranoid: true,
        timestamps: true,
        tableName: 'products',
      }
    );

    return ProductModel;
  }

  static setupAssociation(CategoryModel, BrandModel, DiscountModel) {
    ProductModel.belongsToMany(CategoryModel, {
      through: 'category_products',
      foreignKey: 'product_id',
      as: 'categories',
    });
    ProductModel.belongsToMany(DiscountModel, {
      through: 'discount_products',
      foreignKey: 'product_id',
      as: 'discounts',
    });
    ProductModel.belongsTo(BrandModel, { foreignKey: 'brandFk' });

    return ProductModel;
  }
};
