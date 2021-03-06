'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  choosingType: require('./scripts/choosingType'),
  choosingRights: require('./scripts/choosingRights'),
  choosingParent: require('./scripts/choosingParent'),
  confirmation: require('./scripts/confirmation'),
};

const revolution = (ctx, { state } = {}) => DICT[state || 'noState'](ctx);

module.exports = revolution;
