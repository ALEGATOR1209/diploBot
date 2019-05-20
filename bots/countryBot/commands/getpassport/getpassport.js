'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  choosingCountryToLive: require('./scripts/choosingCountryToLive'),
};

const getpassport = (ctx, { state } = {}) => DICT[state || 'noState'](ctx);

module.exports = getpassport;
