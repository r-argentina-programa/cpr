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
            model: 'brands',
            key: 'id',
          },
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
        modelName: 'Product',
        underscored: true,
        paranoid: true,
        timestamps: false,
      }
    );

    return ProductModel;
  }

  static setupAssociation(BrandModel, CategoryModel, DiscountModel) {
    ProductModel.belongsTo(BrandModel, {
      foreignKey: 'brandFk',
      as: 'brand',
    });
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
  }
};
