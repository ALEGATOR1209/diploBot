'use strict';

const changeclass = async charon => {
  const {
    getAdmins,
    getAllClasses,
    findUser,
    setState,
    getChildClasses,
    getText,
    getGame,
  } = charon.get([
    'getAdmins',
    'getAllClasses',
    'findUser',
    'setState',
    'getChildClasses',
    'getText',
    'getGame',
  ]);
  const text = t => getText('changeclass')[t];
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
    charon.reply(text(0) + text(3));
    return;
  }
  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(4));
    return;
  }
  const classlist = getAllClasses(country.chat);
  const userClassName = country.citizens[id].class;

  const childClasses = getChildClasses(userClassName, classlist);
  if (childClasses.length < 1) {
    charon.reply(text(0) + text(5));
    return;
  }

  const slavelist = Object.keys(country.citizens)
    .filter(man =>
      childClasses.includes(country.citizens[man].class) ||
      man === id + ''
    );

  if (slavelist.length < 1) {
    charon.reply(text(0) + text(6));
    return;
  }

  const slaveTags = [];
  for (const slave of slavelist) {
    const { username } = await charon.getChat(slave);
    slaveTags.push(`@${username}`);
  }
  charon.reply(
    text(0) + text(7),
    { buttons: [...slaveTags, text(11)] }
  );
  setState(id, 'changeclass', 'choosingTarget');
};

module.exports = changeclass;
