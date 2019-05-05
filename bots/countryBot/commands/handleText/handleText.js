'use strict';

const Markup = require('telegraf/markup');
// const {
//   getAdmins,
//   getStates,
//   createClass,
//   getText,
//   changeUserClass,
//   deleteClass,
//   setMigrantClass,
//   startRevolution,
//   unbanPeople,
//   showLaw,
//   addLaw,
//   removeLaw,
//   sendOrders,
//   showCountryOrders,
//   showClass,
// } = require('../../../imports').few('countryBot', 'scripts',
//   [
//     'getAdmins',
//     'getStates',
//     'createClass',
//     'getText',
//     'changeUserClass',
//     'deleteClass',
//     'setMigrantClass',
//     'startRevolution',
//     'unbanPeople',
//     'showLaw',
//     'addLaw',
//     'removeLaw',
//     'sendOrders',
//     'showCountryOrders',
//     'showClass',
//   ]);
const text = t => getText('handleText')[t];
// const STATE_HANDLERS = {
//   creatingClass           : createClass,
//   changingUserClass       : changeUserClass,
//   deletingClass           : deleteClass,
//   settingMigrantClass     : setMigrantClass,
//   preparingRevolution     : startRevolution,
//   choosingPeopleToUnban   : unbanPeople,
//   choosingLaw             : showLaw,
//   addingLaw               : addLaw,
//   removingLaw             : removeLaw,
//   sendingOrders           : sendOrders,
//   watchingOrders          : showCountryOrders,
//   showClass               : showClass,
// };

const handleText = ctx => {
  const { type } = ctx.message.chat;
  const { id } = ctx.message.from;

  // const states = getStates(id);
  // if (states) {
  //   STATE_HANDLERS[Object.keys(states)[0]](ctx);
  //   return;
  // }
  if (ctx.message.text && ctx.message.text[0] === '/') {
    ctx.reply(text(3), { reply_to_message_id: ctx.message.message_id });
    return;
  }

  if (type === 'private') {
    const admins = getAdmins();
    ctx.reply(text(1), Markup.removeKeyboard(true).extra(),);
    ctx.reply(text(2) + `\n@${admins.join('\n@')}`);
  }
};

module.exports = handleText;
