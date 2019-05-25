'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  enteringName: require('./scripts/enteringName'),
  enteringRights: require('./scripts/enteringRights'),
  enteringNumber: require('./scripts/enteringNumber'),
  confirmation: require('./scripts/confirmation'),
};

const getpassport = (ctx, { state } = {}) => DICT[state || 'noState'](ctx);

module.exports = getpassport;
