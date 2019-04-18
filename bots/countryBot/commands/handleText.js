'use strict';

const Markup = require('telegraf/markup');
const {
  getAdmins,
  getStates,
  createClass,
  getText,
  changeUserClass,
  deleteClass,
  setMigrantClass,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getStates',
    'createClass',
    'getText',
    'changeUserClass',
    'deleteClass',
    'setMigrantClass',
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
    if (states.deletingClass) {
      deleteClass(ctx);
      return;
    }
    if (states.settingMigrantClass) {
      setMigrantClass(ctx);
      return;
    }
  }

  if (type === 'private') {
    const admins = getAdmins();
    ctx.reply(text(1), Markup.removeKeyboard(true).extra(),);
    ctx.reply(text(2) + `\n@${admins.join('\n@')}`);
  }
};

module.exports = handleText;
