'use strict';

const deleteclass = charon => {
  const {
    getAdmins,
    getText,
    findUser,
    getChildClasses,
    getAllClasses,
    setState,
    getMigrationClass,
    getGame,
  } = charon.get([
    'getAdmins',
    'getText',
    'findUser',
    'getChildClasses',
    'getAllClasses',
    'setState',
    'getMigrationClass',
    'getGame',
  ]);
  const text = t => getText('deleteclass')[t];
  const { id } = charon.message.from;

  if (getGame('turn') === 0) {
    charon.reply(getText('0turnAlert'));
    return;
  }

  if (getAdmins().includes(id)) {
    charon.reply(text(0) + text(1));
    return;
  }

  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(2));
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(7));
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(9));
  }
  const classlist = getAllClasses(country.chat);
  const userClass = country.citizens[id].class;
  const childClasses = getChildClasses(userClass, classlist);
  if (childClasses.length < 1) {
    charon.reply(text(0) + text(3));
    return;
  }
  let emptyClasses = childClasses.filter(classname => {
    for (const man in country.citizens) {
      if (country.citizens[man].class === classname) return false;
    }
    return true;
  });
  emptyClasses = emptyClasses
    .filter(cl =>
      getChildClasses(cl, classlist).length === 0 &&
      getMigrationClass(country.chat) !== cl
    );

  if (emptyClasses.length < 1) {
    charon.reply(text(0) + text(4));
    return;
  }
  emptyClasses.push(text(6));
  charon.reply(
    text(0) + text(5),
    { buttons: emptyClasses }
  );

  setState(id, 'deleteclass', 'choosingClass');
};

module.exports = deleteclass;
