'use strict';

const show = charon => {
  const {
    getText,
    getCountry,
    setState,
    getStates,
  } = charon.get([
    'getText',
    'getCountry',
    'setState',
    'getStates',
  ]);
  const text = t => getText('showlaw')[t];

  const { id } = charon.message.from;
  const country = getCountry(getStates(id).showlaw);
  if (!country) {
    charon.reply(text(0) + text(1));
    setState(id, 'showlaw', null);
    return;
  }
  const lawlist = country.laws;
  const list = Object.keys(lawlist)
    .filter(law => !law.WIP);
  if (list.length < 1) {
    charon.reply(text(2));
    setState(id, 'showlaw', null);
    return;
  }
  const law = charon.message.text;
  if (law === text(6)) {
    charon.reply(text(0) + text(7));
    setState(id, 'showlaw', null);
    return;
  }
  if (!list.includes(law)) {
    charon.reply(text(0) + text(3));
    setState(id, 'showlaw', null);
    return;
  }

  charon.reply(
    text(4).replace('{name}', law) +
    `<b>${country.name}</b>` +
    text(5).replace('{date}', lawlist[law].date) +
    lawlist[law].text
  );
  setState(id, 'showlaw', null);
};

module.exports = show;
