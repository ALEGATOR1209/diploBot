'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  choosingCountry: require('./scripts/choosingCountry'),
};

const orders = (ctx, { state } = {}) => DICT[state || 'noState'](ctx);

module.exports = orders;
