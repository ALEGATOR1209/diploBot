'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  choosingClass: require('./scripts/choosingClass'),
};

const migrantclass = (ctx, { state } = {}) => DICT[state || 'noState'](ctx);

module.exports = migrantclass;
