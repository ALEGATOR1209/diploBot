'use strict';

const show = charon => {
  const {
    getText,
    setState,
    findUser,
  } = charon.get([
    'getText',
    'setState',
    'findUser',
  ]);
  const text = t => getText('showclass')[t];

  const { id } = charon.message.from;
  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(1));
    setState(id, 'showlaw', null);
    return;
  }
  const classlist = Object.keys(country.classes)
    .filter(cl => !country.classes[cl].creator);
  if (classlist.length < 1) {
    charon.reply(text(4));
    setState(id, 'showlaw', null);
    return;
  }
  const classToShowName = charon.message.text;
  if (!classToShowName.includes(classlist)) {
    charon.reply(text(0) + text(4));
    setState(id, 'showlaw', null);
    return;
  }
  const classToShow = country.classes[classToShowName];
  const num = Object.values(country.citizens)
    .filter(man => man.class === classToShowName)
    .length;
  const max = classToShow.number;

  charon.reply(
    text(5) + classToShowName +
    text(6) + (classToShow.parent || text(11)) +
    text(7) + (max || text(8)) +
    text(9) + num +
    (max ? (num === max ? text(10) : '') : '')
  );
  setState(id, 'showlaw', null);
};

module.exports = show;
