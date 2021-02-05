module.exports = {
  up: async (queryInterface, Sequelize) => {
    /** @param {import('sequelize').queryInterface} queryInterface */

    return Promise.all([
      queryInterface.createTable('category_products', {
        product_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        category_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
      }),
      queryInterface.createTable('discount_brand', {
        discount_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        brand_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
      }),
      queryInterface.createTable('discount_category', {
        discount_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        category_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
      }),
      queryInterface.createTable('discount_products', {
        discount_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        product_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /** @param {import('sequelize').queryInterface} queryInterface */

    return Promise.all([
      queryInterface.dropTable('category_products'),
      queryInterface.dropTable('discount_products'),
      queryInterface.dropTable('discount_brand'),
      queryInterface.dropTable('discount_category'),
    ]);
  },
};
