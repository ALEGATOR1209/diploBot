'use strict';

const handleText = async charon => {
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
    charon.reply(text(3));
    return;
  }

  if (type === 'private') {
    const adminsIds = getAdmins();
    const adminsNicks = [];
    for (const id of adminsIds) {
      const { username } = await charon.getChat(id);
      adminsNicks.push(`@${username}`);
    }
    charon.reply(text(1) + '\n\n' + text(2) + `\n${adminsNicks.join('\n')}`);
  }
};

module.exports = handleText;
