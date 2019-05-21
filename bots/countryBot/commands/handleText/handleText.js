'use strict';

const handleText = charon => {
  const {
    getAdmins,
    getText,
    getStates,
    getpassport,
    addclass,
    showclass,
    changeclass,
    deleteclass,
    migrantclass,
    revolution,
    showlaw,
    addlaw,
    rmlaw,
    orders,
    sendorders,
  } = charon.get([
    'getAdmins',
    'getText',
    'getStates',
    'getpassport',
    'addclass',
    'showclass',
    'changeclass',
    'deleteclass',
    'migrantclass',
    'revolution',
    'showlaw',
    'addlaw',
    'rmlaw',
    'orders',
    'sendorders',
  ]);
  const text = t => getText('handleText')[t];
  const STATE_HANDLERS = {
    getpassport,
    addclass,
    showclass,
    changeclass,
    deleteclass,
    migrantclass,
    revolution,
    showlaw,
    addlaw,
    rmlaw,
    orders,
    sendorders,
  };

  const { type } = charon.message.chat;
  const { id } = charon.message.from;

  const states = getStates(id);
  if (states) {
    const state = Object.keys(states)[0];
    STATE_HANDLERS[state](charon, { state: states[state] });
    return;
  }
  if (charon.message.text && charon.message.text[0] === '/') {
    charon.reply(text(3), { reply_to_message_id: charon.message.message_id });
    return;
  }

  if (type === 'private') {
    const admins = getAdmins();
    charon.reply(text(1) + '\n\n' + text(2) + `\n@${admins.join('\n@')}`);
  }
};

module.exports = handleText;
