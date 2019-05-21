'use strict';

const choosingRights = charon => {
  const {
    findUser,
    getText,
    getRevolution,
    setState,
    setRevolution,
    getAllRights: rightlist,
    rightsString,
  } = charon.get([
    'findUser',
    'getText',
    'getRevolution',
    'setState',
    'setRevolution',
    'getAllRights',
    'rightsString',
  ]);
  const text = t => getText('revolution')[t];

  const { id } = charon.message.from;

  const country = findUser(id);
  if (!country) {
    charon.reply(text(0) + text(2));
    setState(id, 'revolution', null);
    setRevolution(country.chat, id);
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

  const right = charon.message.text;
  //Cancel
  if (right.match(new RegExp(`^${text(5)}$`))) {
    charon.reply(text(0) + text(7));
    setState(id, 'revolution', null);
    setRevolution(country.chat, id);
    return;
  }
  //Done
  if (right.match(new RegExp(`^${text(12)}$`))) {
    charon.reply(
      text(0) + text(14),
      { buttons: [text(15), text(16)] }
    );
    setState(id, 'revolution', 'confirmation');
    return;
  }

  const userClass = country.citizens[id].class;
  const parentClass = country.classes[userClass].parentClass;
  const parentRights = country.classes[parentClass].rights;
  const rightCode = Object.keys(rightlist).find(el => rightlist[el] === right);

  const revolution = getRevolution(country.chat, id);
  if (!revolution) {
    charon.reply(text(0) + text(17));
    setState(id, 'revolution', null);
    return;
  }
  if (!revolution.demands) revolution.demands = [];

  const otherRights = parentRights.filter(
    el => !revolution.demands.includes(el)
  ).map(el => rightlist[el]);
  if (!rightCode) {
    charon.reply(
      text(0) + text(19) + text(21),
      { buttons: [text(12), text(5), ...otherRights] }
    );
    return;
  }
  if (country.classes[userClass].rights.includes(right)) {
    charon.reply(
      text(0) + text(18),
      { buttons: [text(12), text(5), ...otherRights] }
    );
    return;
  }
  if (!parentRights.includes(rightCode)) {
    charon.reply(
      text(0) + text(20),
      { buttons: [text(12), text(5), ...otherRights] }
    );
    return;
  }

  revolution.demands.push(rightCode);
  setRevolution(country.chat, id, revolution);
  charon.reply(
    text(0) + text(22) + text(21) +
    rightsString([...country.classes[userClass].rights, ...revolution.demands]),
    {
      buttons: [
        text(12),
        text(5),
        ...otherRights
          .filter(freedom => freedom !== right)
      ]
    }
  );
};

module.exports = choosingRights;
