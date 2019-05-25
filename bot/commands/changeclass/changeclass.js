'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  choosingTarget: require('./scripts/choosingTarget'),
  choosingClass: require('./scripts/choosingClass'),
};

const changeclass = (ctx, { state } = {}) => {
  if (state === undefined) {
    return DICT.noState(ctx);
  }
  if (state === 'choosingTarget') {
    return DICT.choosingTarget(ctx);
  }
  DICT.choosingClass(ctx);
};

module.exports = changeclass;
