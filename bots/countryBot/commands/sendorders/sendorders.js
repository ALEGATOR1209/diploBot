'use strict';

const DICT = {
  noState: require('./scripts/noState'),
  enteringOrders: require('./scripts/enteringOrders'),
};

const sendorders = (ctx, { state } = {}) => DICT[state ? 'enteringOrders' : 'noState'](ctx);

module.exports = sendorders;
