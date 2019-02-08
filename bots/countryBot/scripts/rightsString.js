'use strict';

const getAllRights = require('./getAllRights');

const rightsString = rights => getAllRights.reduce(
  (acc, freedom) => acc + (
    rights.includes(freedom) ? '✅ ' : '❌ '
  ) + freedom + '\n', ''
);

module.exports = rightsString;
