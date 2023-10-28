
module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await QueryInterface.createTable('images', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      imageId: {
        type: Sequelize.STRING,
        field: 'image_id'
      },
      conceptName: {
        type: Sequelize.STRING(255),
        field: 'concept_name',
      },
      isLandscape: {
        type: Sequelize.BOOLEAN,
        field: 'is_landscape',
      },
      cloudfrontUri: {
        type: Sequelize.STRING(255),
        field: 'cloudfront_uri',
      },
      packageName: {
        type: Sequelize.STRING(255),
        field: 'package_name',
      },
      albumId: {
        type: Sequelize.STRING(255),
        field: 'album_id',
      },
      isCoverImage: {
        type: Sequelize.BOOLEAN,
        field: 'is_cover_image',
      },
      albumName: {
        type: Sequelize.STRING(255),
        field: 'album_name',
      },
      key: {
        type: Sequelize.STRING(255),
        field: 'key',
      },
      imageUri: {
        type: Sequelize.STRING(255),
        field: 'image_uri',
      }, 
       createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      },
    });
  },

  down: async (queryInterface) => queryInterface.dropTable('images'),
};
