'use strict';

const {
  getAllRights
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAllRights',
  ]);

const rightsString = rights => getAllRights.reduce(
  (acc, freedom) => acc + (
    rights.includes(freedom) ? '✅ ' : '❌ '
  ) + freedom + '\n', ''
);

module.exports = rightsString;
