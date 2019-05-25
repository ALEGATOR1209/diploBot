'use strict';

const enteringRights = charon => {
  const {
    setState,
    findUser,
    getAllRights: rightslist,
    newClass,
    getText,
    rightsString,
    getDead,
    removeClass,
  } = charon.get(
    [
      'setState',
      'findUser',
      'getAllRights',
      'newClass',
      'getText',
      'rightsString',
      'getDead',
      'removeClass',
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
    charon.reply(text(0) + text(6));
    setState(id, 'addclass', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(5));
    setState(id, 'addclass', null);
    return;
  }

  const input = charon.message.text;
  //Done
  if (input.match(new RegExp(`^${text(10)}$`, 'gi'))) {
    charon.reply(text(0) + text(12));
    setState(id, 'addclass', 'enteringNumber');
    return;
  }

  //Cancel
  if (input.match(new RegExp(`^${text(11)}$`, 'gi'))) {
    charon.reply(text(0) + text(13));
    Object.keys(country.classes)
      .filter(cl => country.classes[cl].creator === id)
      .forEach(cl => removeClass(country.chat, cl));
    setState(id, 'addclass', null);
    return;
  }

  const rightCode = Object.keys(rightslist)
    .find(right => rightslist[right] === input);
  if (!rightCode) {
    charon.reply(text(0) + text(8));
    return;
  }
  const parentClassName = country.citizens[id].class;
  const userClassName = Object.keys(country.classes)
    .find(cl => country.classes[cl].creator === id);
  const parentClass = country.classes[parentClassName];
  const userClass = country.classes[userClassName];
  if (!parentClass.rights.includes(rightCode)) {
    const list = Object.keys(rightslist)
      .filter(right =>
        parentClass.rights.includes(right) &&
        !userClass.rights.includes(right))
      .map(code => rightslist[code]);
    charon.reply(
      text(0) + text(25),
      {
        buttons: [ text(10), text(11), ...list ],
        type: 'keyboard',
      }
    );
    return;
  }

  userClass.rights.push(rightCode);
  newClass(country.chat, userClassName, userClass);
  const list = Object.keys(rightslist)
    .filter(right =>
      parentClass.rights.includes(right)  &
      !userClass.rights.includes(right))
    .map(code => rightslist[code]);
  charon.reply(
    text(0) +
    text(9) + rightsString(userClass.rights),
    {
      buttons: [text(10), text(11), ...list],
      type: 'keyboard',
    }
  );
};

module.exports = enteringRights;
