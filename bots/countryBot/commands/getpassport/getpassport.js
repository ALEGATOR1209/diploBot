'use strict';

const DICTIONARY = {
  noState: require('./scripts/noState'),
  choosingCountryToLive: require('./scripts/choosingCountryToLive'),
};

const getpassport = (ctx, { state }) => DICTIONARY[state || 'noState'](ctx);

module.exports = getpassport;
