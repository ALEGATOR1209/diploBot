'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  show: require('./scripts/show'),
};

const showlaw = (ctx, { state } = {}) => DICT[state ? 'show' : 'noState'](ctx);

module.exports = showlaw;
