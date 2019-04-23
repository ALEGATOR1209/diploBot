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
  startRevolution,
  unbanPeople,
  showLaw,
  addLaw,
  removeLaw,
  sendOrders,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getStates',
    'createClass',
    'getText',
    'changeUserClass',
    'deleteClass',
    'setMigrantClass',
    'startRevolution',
    'unbanPeople',
    'showLaw',
    'addLaw',
    'removeLaw',
    'sendOrders',
  ]);
const text = t => getText('handleText')[t];
const STATE_HANDLERS = {
  creatingClass: createClass,
  changingUserClass: changeUserClass,
  deletingClass: deleteClass,
  settingMigrantClass: setMigrantClass,
  preparingRevolution: startRevolution,
  choosingPeopleToUnban: unbanPeople,
  choosingLaw: showLaw,
  addingLaw: addLaw,
  removingLaw: removeLaw,
  sendingOrders: sendOrders,
};

const handleText = ctx => {
  const { type } = ctx.message.chat;
  const { id } = ctx.message.from;

  const states = getStates(id);
  if (states) {
    for (const state of Object.keys(states))
      STATE_HANDLERS[state](ctx);
    return;
  }

  if (type === 'private') {
    const admins = getAdmins();
    ctx.reply(text(1), Markup.removeKeyboard(true).extra(),);
    ctx.reply(text(2) + `\n@${admins.join('\n@')}`);
  }
};

module.exports = handleText;
