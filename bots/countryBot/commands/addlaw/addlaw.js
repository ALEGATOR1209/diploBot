'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  enteringLaw: require('./scripts/enteringLaw'),
  confirmation: require('./scripts/confirmation'),
};

const addlaw = (ctx, { state } = {}) => DICT[state || 'noState'](ctx);

module.exports = addlaw;
