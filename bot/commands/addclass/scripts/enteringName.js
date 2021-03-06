'use strict';

const enteringName = charon => {
  const {
    setState,
    findUser,
    getAllRights: rightslist,
    newClass,
    getText,
    rightsString,
    getDead,
  } = charon.get([
    'setState',
    'findUser',
    'getAllRights',
    'newClass',
    'getText',
    'rightsString',
    'getDead',
  ]);
  const text = t => getText('addclass')[t];
  const { id } = charon.message.from;
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
    charon.charon.reply(text(0) + text(6), charon.reply);
    setState(id, 'addclass', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(5));
    setState(id, 'addclass', null);
    return;
  }

  let name = charon.message.text;

  if (!name) {
    charon.reply(text(0) + text(8));
    return;
  }
  name = name.trim();
  if (name.match(/\./gi)) {
    charon.reply(text(0) + text(24));
    return;
  }
  if (country.classes[name] && Object.keys(country.classes[name]).length > 0) {
    charon.reply(text(0) + text(23));
    setState(id, 'addclass', null);
    return;
  }

  const createdClass = {
    creator: id,
    rights: [],
    parentClass: country.citizens[id].class,
    number: 0,
  };

  newClass(country.chat, name, createdClass);
  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  const list = Object.keys(rightslist)
    .filter(right => userClass.rights.includes(right))
    .map(code => rightslist[code]);
  charon.reply(
    text(0) + text(9) + rightsString([]),
    { buttons: [text(10), text(11), ...list] }
  );
  setState(id, 'addclass', 'enteringRights');
};

module.exports = enteringName;
