'use strict';

const choosingParent = charon => {
  const {
    findUser,
    getText,
    getRevolution,
    setState,
    setRevolution,
  } = charon.get([
    'findUser',
    'getText',
    'getRevolution',
    'setState',
    'setRevolution',
  ]);
  const text = t => getText('revolution')[t];
  const { id } = charon.message.from;

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

  const newParent = charon.message.text;
  const userClass = country.citizens[id].class;
  if (!Object.keys(country.classes).includes(newParent)) {
    charon.reply(
      text(0) + text(8),
      {
        buttons: Object.keys(country.classes)
          .filter(cl =>
            cl !== userClass &&
            cl !== userClass.parentClass
          )
      }
    );
    setState(id, 'revolution', null);
    return;
  }

  const revolution = getRevolution(country.chat, id);
  if (!revolution) {
    charon.reply(text(0) + text(8));
    setState(id, 'revolution', null);
    return;
  }

  revolution.demands = newParent;
  setRevolution(country.chat, id, revolution);
  setState(id, 'revolution', 'confirmation');

  charon.reply(
    text(0) +
    text(22) +
    text(23)
      .replace('{parent}', newParent)
      .replace('{child}', userClass) +
    text(14),
    { buttons: [text(15), text(16)] }
  );
};

module.exports = choosingParent;
