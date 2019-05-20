'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  choosingLaw: require('./scripts/choosingLaw'),
};

const rmlaw = (ctx, { state } = {}) => DICT[state || 'noState'](ctx);

module.exports = rmlaw;
