'use strict';

const {
  getAllRights
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAllRights',
  ]);

const rightsString = rights => Object.keys(getAllRights).reduce(
  (acc, freedom) => acc + (
    rights.includes(freedom) ? '✅ ' : '❌ '
  ) + getAllRights[freedom] + '\n', ''
);

module.exports = rightsString;
