'use strict';

const choosingTarget = async charon => {
  const {
    setState,
    findUser,
    getText,
    getAllClasses,
    getChildClasses,
  } = charon.get([
    'setState',
    'findUser',
    'getText',
    'getAllClasses',
    'getChildClasses',
  ]);
  const text = t => getText('changeclass')[t];

  const { id } = charon.message.from;
  if (charon.message.text === text(11)) {
    setState(id, 'changeclass', null);
    charon.reply(text(0) + text(12));
    return;
  }
  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(2));
    setState(id, 'changeclass', null);
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(3));
    setState(id, 'changeclass', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(4));
    setState(id, 'changeclass', null);
    return;
  }
  const classlist = getAllClasses(country.chat);
  const userClassName = country.citizens[id].class;

  const childClasses = getChildClasses(userClassName, classlist);
  if (childClasses.length < 1) {
    charon.reply(text(0) + text(5));
    setState(id, 'changeclass', null);
    return;
  }

  const slavelist = Object.keys(country.citizens)
    .filter(man =>
      childClasses.includes(country.citizens[man].class) ||
      man === id + ''
    );
  if (slavelist.length < 1) {
    charon.reply(text(0) + text(6));
    setState(id, 'changeclass', null);
    return;
  }

  const { mentions } = charon;
  for (const person of mentions) {
    const { id: targetId } = person;
    const targetCountry = findUser(targetId);

    if (targetCountry.chat !== country.chat) {
      charon.reply(text(0) + text(9));
      setState(id, 'changeclass', null);
      return;
    }

    const targetClass = country.citizens[targetId].class;
    if (!childClasses.includes(targetClass) && targetId !== id) {
      charon.reply(text(0) + text(10));
      setState(id, 'changeclass', null);
      return;
    }

    charon.reply(
      text(0) + text(13),
      { buttons: [...childClasses, text(11)] }
    );
    setState(id, 'changeclass', targetId);
    return;
  }
};

module.exports = choosingTarget;
