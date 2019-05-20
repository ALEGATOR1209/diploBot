'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  setState,
  getStates,
  getText,
  getCountry,
  findUser,
  setLaw,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'setState',
    'getStates',
    'getText',
    'getCountry',
    'findUser',
    'setLaw',
  ]);
const text = t => getText('rmlaw')[t];
const answer = (ctx, text) => ctx.reply(
  text,
  Extra
    .load({
      reply_to_message_id: ctx.message.message_id,
    })
    .markup(Markup
      .removeKeyboard(true)
      .selective(true)
    )
);

const choosingLaw = ctx => {
  const reply = answer.bind(null, ctx);
  const { id } = ctx.message.from;

  const country = findUser(id);
  if (!country) {
    reply(text(0) + text(2));
    setState(id, 'choosingLaw', null);
    return;
  }
  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('ADOPTING_LAWS')) {
    reply(text(0) + text(3));
    setState(id, 'choosingLaw', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    reply(text(0) + text(4));
    setState(id, 'choosingLaw', null);
    return;
  }

  const lawlist = country.laws;
  if (!lawlist || Object.keys(lawlist) < 1) {
    reply(text(0) + text(7));
    setState(id, 'choosingLaw', null);
    return;
  }

  const lawName = ctx.message.text;
  if (lawName === text(6)) {
    reply(text(0) + text(9));
    setState(id, 'choosingLaw', null);
    return;
  }
  const law = lawlist[lawName];
  if (!law || law.WIP) {
    reply(text(0) + text(10));
    setState(id, 'choosingLaw', null);
    return;
  }

  reply(text(0) + text(11));
  setLaw(country.chat, lawName, null);
  setState(id, 'removingLaw', null);
  if (ctx.message.chat.username !== country.chat) {
    ctx.reply(
      text(12).replace('{law}', lawName),
      {
        chat_id: `@${country.chat}`,
        parse_mode: 'HTML',
      }
    );
  }
};

module.exports = choosingLaw;
