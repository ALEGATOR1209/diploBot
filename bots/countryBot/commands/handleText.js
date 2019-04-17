'use strict';

const {
  getAdmins,
  getStates,
  createClass,
  getText,
  changeUserClass
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getStates',
    'createClass',
    'getText',
    'changeUserClass',
  ]);
const text = t => getText('handleText')[t];

const handleText = ctx => {
  const { type } = ctx.message.chat;
  const { id } = ctx.message.from;

  const states = getStates(id);
  if (states) {
    if (states.creatingClass) {
      createClass(ctx);
      return;
    }
    if (states.changingUserClass) {
      changeUserClass(ctx);
      return;
    }
  }

  if (type === 'private') {
    const admins = getAdmins();
    ctx.reply(text(1));
    ctx.reply(text(2) + `\n@${admins.join('\n@')}`);
  }
};

module.exports = handleText;
