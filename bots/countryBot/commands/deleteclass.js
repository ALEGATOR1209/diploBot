'use strict';

const getAdmins = require('./getAdmins');
const getText = id => require('./getText')(`deleteclass.${id}`);
const {
  getAdmins,
  getText
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getText',
  ]);
const text = t => getText('addclass')[t];

const deleteclass = ctx => {
  const { username, id } = ctx.message.from;
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(text(1));
    return;
  }
};

module.exports = deleteclass;
