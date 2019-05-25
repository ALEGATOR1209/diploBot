'use strict';

const choosingClass = charon => {
  const {
    getText,
    findUser,
    setState,
    setMigrationClass,
  } = charon.get([
    'getText',
    'findUser',
    'setState',
    'setMigrationClass',
  ]);
  const text = t => getText('migrantclass')[t];
  const { id } = charon.message.from;

  if (charon.message.text.match(new RegExp(`^${text(4)}$`, 'gi'))) {
    charon.reply(text(0) + text(7));
    setState(id, 'migrantclass', null);
    return;
  }

  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(1));
    setState(id, 'migrantclass', null);
    return;
  }

  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(3));
    setState(id, 'migrantclass', null);
    return;
  }

  const userClass = country.citizens[id].class;
  const hasLawRights = country
    .classes[userClass]
    .rights
    .includes('ADOPTING_LAWS');
  if (!hasLawRights) {
    charon.reply(text(0) + text(2));
    setState(id, 'migrantclass', null);
    return;
  }

  const classlist = Object.keys(country.classes)
    .filter(cl => !(country.classes[cl].number || country.migrantClass === cl));

  if (classlist.length < 1) {
    charon.reply(text(0) + text(11));
    setState(id, 'migrantclass', null);
    return;
  }
  const migrantClass = charon.message.text;
  if (!classlist.includes(migrantClass)) {
    charon.reply(text(0) + text(8));
    setState(id, 'migrantclass', null);
    return;
  }

  setMigrationClass(country.chat, migrantClass);
  if (country.chat !== charon.message.chat.username) {
    charon.reply(
      text(0) + text(9)
        .replace('{class}', migrantClass),
      null,
      { chat_id: `@${country.chat}` }
    );
  }
  charon.reply(text(0) + text(10));
  setState(id, 'migrantclass', null);
};

module.exports = choosingClass;
