'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  getRevolution,
  setState,
  setRevolution,
  getAllRights: rightlist,
  rightsString,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getRevolution',
    'setState',
    'setRevolution',
    'getAllRights',
    'rightsString',
  ]);
const text = t => getText('revolution')[t];
const answer = (
  ctx,
  text,
  markup = Markup
    .removeKeyboard(true)
    .selective(true),
  options = null
) => ctx
  .reply(
    text,
    Extra
      .load(options || {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'HTML',
      })
      .markup(markup)
  );

const choosingRights = ctx => {
  const reply = answer.bind(null, ctx);
  const { id } = ctx.message.from;

  const country = findUser(id);
  if (!country) {
    reply(text(0) + text(2));
    setState(id, 'revolution', null);
    setRevolution(country.chat, id);
    return;
  }

  const inPrison = country.citizens[id].inPrison;
  if (inPrison) {
    reply(text(0) + text(3));
    setState(id, 'revolution', null);
    setRevolution(country.chat, id);
    return;
  }
  if (country.hasRevolution) {
    reply(text(0) + text(4));
    setRevolution(country.chat, id);
    setState(id, 'revolution', null);
    return;
  }

  const right = ctx.message.text;
  //Cancel
  if (right.match(new RegExp(`^${text(5)}$`))) {
    reply(text(0) + text(7));
    setState(id, 'revolution', null);
    setRevolution(country.chat, id);
    return;
  }
  //Done
  if (right.match(new RegExp(`^${text(12)}$`))) {
    reply(text(0) + text(14), Markup
      .keyboard([text(15), text(16)])
      .oneTime()
      .resize()
      .selective(true)
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
    reply(text(0) + text(17));
    setState(id, 'revolution', null);
    return;
  }
  if (!revolution.demands) revolution.demands = [];

  const otherRights = parentRights.filter(
    el => !revolution.demands.includes(el)
  ).map(el => rightlist[el]);
  if (!rightCode) {
    reply(text(0) + text(19) + text(21), Markup
      .keyboard([text(12), text(5), ...otherRights])
      .oneTime()
      .resize()
      .selective(true)
    );
    return;
  }
  if (country.classes[userClass].rights.includes(right)) {
    reply(text(0) + text(18), Markup
      .keyboard([text(12), text(5), ...otherRights])
      .oneTime()
      .resize()
      .selective(true)
    );
    return;
  }
  if (!parentRights.includes(rightCode)) {
    reply(text(0) + text(20), Markup
      .keyboard([text(12), text(5), ...otherRights])
      .oneTime()
      .resize()
      .selective(true)
    );
    return;
  }

  revolution.demands.push(rightCode);
  setRevolution(country.chat, id, revolution);
  reply(
    text(0) + text(22) + text(21) +
    rightsString([...country.classes[userClass].rights, ...revolution.demands]),
    Markup
      .keyboard([
        text(12),
        text(5),
        ...otherRights
          .filter(freedom => freedom !== right)
      ])
      .oneTime()
      .resize()
      .selective(true)
  );
};

module.exports = choosingRights;
