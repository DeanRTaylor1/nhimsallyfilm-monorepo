'use strict';

const data = require('../output.json');

function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function mapKeysToSnakeCase(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [toSnakeCase(key), value])
  );
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('images', data.map((obj, index) => {
return { id: index, ...mapKeysToSnakeCase(obj) }
    } ), {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('images', null, {});
  }
};
