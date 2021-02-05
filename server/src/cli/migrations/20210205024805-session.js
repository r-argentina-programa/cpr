module.exports = {
  up: async (queryInterface, Sequelize) => {
    /** @param {import('sequelize').queryInterface} queryInterface */
    return queryInterface.createTable('Session', {
      sid: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
      },
      expires: {
        type: Sequelize.DataTypes.DATE,
      },
      data: {
        type: Sequelize.DataTypes.TEXT,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /** @param {import('sequelize').queryInterface} queryInterface */
    return queryInterface.dropTable('Session');
  },
};
