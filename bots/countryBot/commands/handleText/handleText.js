'use strict';

const Markup = require('telegraf/markup');
const {
  getAdmins,
  getText,
  getStates,
} = require('../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'getText',
    'getStates',
  ]);

const {
  getpassport,
  addclass,
  showclass,
  changeclass,
  deleteclass,
  migrantclass,
} = require('../../../imports').few('countryBot', 'commands', [
  'getpassport',
  'addclass',
  'showclass',
  'changeclass',
  'deleteclass',
  'migrantclass',
]);
const text = t => getText('handleText')[t];
const STATE_HANDLERS = {
  getpassport,
  addclass,
  showclass,
  changeclass,
  deleteclass,
  migrantclass,
//   preparingRevolution     : startRevolution,
//   choosingPeopleToUnban   : unbanPeople,
//   choosingLaw             : showLaw,
//   addingLaw               : addLaw,
//   removingLaw             : removeLaw,
//   sendingOrders           : sendOrders,
//   watchingOrders          : showCountryOrders,
};

const handleText = ctx => {
  const { type } = ctx.message.chat;
  const { id } = ctx.message.from;

  const states = getStates(id);
  if (states) {
    const state = Object.keys(states)[0];
    STATE_HANDLERS[state](ctx, { state: states[state] });
    return;
  }
  if (ctx.message.text && ctx.message.text[0] === '/') {
    ctx.reply(text(3), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (type === 'private') {
    const admins = getAdmins();
    ctx.reply(text(1), Markup.removeKeyboard(true).selective(true));
    ctx.reply(text(2) + `\n@${admins.join('\n@')}`);
  }
};

module.exports = handleText;
