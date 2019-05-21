'use strict';

const confirmation = charon => {
  const {
    setState,
    findUser,
    newClass,
    getText,
    getDead,
    removeClass,
  } = charon.get([
    'setState',
    'findUser',
    'newClass',
    'getText',
    'getDead',
    'removeClass'
  ]);
  const text = t => getText('addclass')[t];
  const { id, username } = charon.message.from;
  if (getDead(id)) {
    charon.reply(text(0) + text(7));
    setState(id, 'addclass', null);
    return;
  }
  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(2));
    setState(id, 'addclass', null);
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(7));
    setState(id, 'addclass', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(5));
    setState(id, 'addclass', null);
    return;
  }

  const { text: message } = charon.message;
  const userClassName = Object.keys(country.classes)
    .find(cl => country.classes[cl].creator === id);
  const userClass = country.classes[userClassName];

  //Yes
  if (message.match(new RegExp(`^${text(17)}$`, 'gi'))) {
    charon.reply(text(0) + text(20));
    if (country.chat !== charon.message.chat.username)
      charon.reply(
        text(26)
          .replace('{username}', `@${username}`)
          .replace('{class}', userClassName),
        null,
        { chat_id: `@${country.chat}` }
      );
    setState(id, 'addclass', null);
    userClass.creator = undefined;
    newClass(country.chat, userClassName, userClass);
    return;
  }

  //No
  if (message.match(new RegExp(`^${text(18)}$`, 'gi'))) {
    charon.reply(text(0) + text(13));
    removeClass(country.chat, userClassName);
    setState(id, 'addclass', null);
    return;
  }

  charon.reply(
    text(0) + text(8),
    { buttons: [text(17), text(18)] }
  );
};

module.exports = confirmation;
