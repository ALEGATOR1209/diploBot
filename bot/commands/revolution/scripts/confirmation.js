'use strict';

const confirmation = charon => {
  const {
    findUser,
    getText,
    getRevolution,
    getGame,
    setState,
    setRevolution,
    revoltToString,
  } = charon.get([
    'findUser',
    'getText',
    'getRevolution',
    'getGame',
    'setState',
    'setRevolution',
    'revoltToString',
  ]);
  const text = t => getText('revolution')[t];
  const { username, id } = charon.message.from;

  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(2));
    setState(id, 'revolution', null);
    return;
  }

  const inPrison = country.citizens[id].inPrison;
  if (inPrison) {
    charon.reply(text(0) + text(3));
    setState(id, 'revolution', null);
    setRevolution(country.chat, id);
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(4));
    setRevolution(country.chat, id);
    setState(id, 'revolution', null);
    return;
  }
  //Cancel
  const { text: message } = charon.message;
  if (message.match(new RegExp(`^${text(16)}$`))) {
    charon.reply(text(0) + text(7));
    setState(id, 'revolution', null);
    setRevolution(country.chat, id);
    return;
  }
  //Done
  if (message.match(new RegExp(`^${text(15)}$`))) {
    charon.reply(text(0) + text(24));
    setState(id, 'revolution', null);
    const revolution = getRevolution(country.chat, id);
    revolution.active = true;
    setRevolution(country.chat, id, revolution, true);
    charon.reply(
      revoltToString(country, id).replace('{leader}', `@${username}`),
      {
        buttons: [
          { text: text(25), action: 'revolt' },
          { text: text(26), action: 'reaction' },
        ],
        type: 'inlineKeyboard'
      },
      { chat_id: `@${country.chat}` }
    );
    charon.reply(
      text(34)
        .replace('{country}', country.name)
        .replace('{leader}', `@${username}`),
      null,
      { chat_id: getGame('gameChannel') }
    );
    return;
  }
  charon.reply(
    text(0) + text(8),
    { buttons: [text(15), text(16)] }
  );
};

module.exports = confirmation;
