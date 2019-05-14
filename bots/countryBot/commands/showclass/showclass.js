'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  show: require('./scripts/show'),
};

const showclass = (ctx, { state } = {}) => DICT[state || 'noState'](ctx);

module.exports = showclass;
