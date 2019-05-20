'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  getRevolution,
  getGame,
  setState,
  setRevolution,
  revoltToString,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getRevolution',
    'getGame',
    'setState',
    'setRevolution',
    'revoltToString',
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

const confirmation = ctx => {
  const reply = answer.bind(null, ctx);
  const { username, id } = ctx.message.from;

  const country = findUser(id);
  if (!country) {
    reply(text(0) + text(2));
    setState(id, 'revolution', null);
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
  //Cancel
  const { text: message } = ctx.message;
  if (message.match(new RegExp(`^${text(16)}$`))) {
    reply(text(0) + text(7));
    setState(id, 'revolution', null);
    setRevolution(country.chat, id);
    return;
  }
  //Done
  if (message.match(new RegExp(`^${text(15)}$`))) {
    reply(text(0) + text(24));
    setState(id, 'revolution', null);
    const revolution = getRevolution(country.chat, id);
    revolution.active = true;
    setRevolution(country.chat, id, revolution, true);
    reply(
      revoltToString(country, id),
      Markup.inlineKeyboard([
        Markup.callbackButton(text(25), 'revolt'),
        Markup.callbackButton(text(26), 'reaction'),
      ]),
      {
        chat_id: `@${country.chat}`,
        parse_mode: 'HTML',
      }
    );
    reply(
      text(34)
        .replace('{country}', country.name)
        .replace('{leader}', `@${username}`),
      null,
      { chat_id: getGame('gameChannel') }
    );
    return;
  }
  reply(text(0) + text(8), Markup
    .keyboard([text(15), text(16)])
    .oneTime()
    .selective(true)
    .resize()
  );
};

module.exports = confirmation;
