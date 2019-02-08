'use strict';
const getAdmins = require('./getAdmins');
const getStates = require('./getStates');
const createClass = require('./createClass');
const getText = id => require('./getText')(`handleText.${id}`);

const handleText = ctx => {
  const { type } = ctx.message.chat;
  const { id } = ctx.message.from;

  const states = getStates(id);
  if (states) {
    if (states.creatingClass) {
      createClass(ctx);
      return;
    }
  }

  if (type === 'private') {
    const admins = getAdmins();
    ctx.reply(getText(1));
    ctx.reply(getText(2) + `\n@${admins.join('\n@')}`);
  }
};

module.exports = handleText;
