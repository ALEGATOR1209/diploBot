'use strict';

const getAdmins = require('./getAdmins');
const getText = id => require('./getText')(`deleteclass.${id}`);

const deleteclass = ctx => {
  const { username, id } = ctx.message.from;
  if (getAdmins().includes(username) || getAdmins().includes(id)) {
    ctx.reply(getText(1));
    return;
  }
};

module.exports = deleteclass;
