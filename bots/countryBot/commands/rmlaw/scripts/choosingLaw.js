'use strict';

const choosingLaw = charon => {
  const {
    setState,
    getText,
    findUser,
    setLaw,
  } = charon.get([
    'setState',
    'getText',
    'findUser',
    'setLaw',
  ]);
  const text = t => getText('rmlaw')[t];

  const { id } = charon.message.from;

  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(2));
    setState(id, 'choosingLaw', null);
    return;
  }
  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('ADOPTING_LAWS')) {
    charon.reply(text(0) + text(3));
    setState(id, 'choosingLaw', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(4));
    setState(id, 'choosingLaw', null);
    return;
  }

  const lawlist = country.laws;
  if (!lawlist || Object.keys(lawlist) < 1) {
    charon.reply(text(0) + text(7));
    setState(id, 'choosingLaw', null);
    return;
  }

  const lawName = charon.message.text;
  if (lawName === text(6)) {
    charon.reply(text(0) + text(9));
    setState(id, 'choosingLaw', null);
    return;
  }
  const law = lawlist[lawName];
  if (!law || law.WIP) {
    charon.reply(text(0) + text(10));
    setState(id, 'choosingLaw', null);
    return;
  }

  charon.reply(text(0) + text(11));
  setLaw(country.chat, lawName, null);
  setState(id, 'removingLaw', null);
  if (charon.message.chat.username !== country.chat) {
    charon.reply(
      text(12).replace('{law}', lawName),
      null,
      { chat_id: `@${country.chat}` }
    );
  }
};

module.exports = choosingLaw;
