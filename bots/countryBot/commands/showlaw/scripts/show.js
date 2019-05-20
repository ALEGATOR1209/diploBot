'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getText,
  getCountry,
  setState,
  getStates,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'getCountry',
    'setState',
    'getStates',
  ]);
const text = t => getText('showlaw')[t];
const answer = (ctx, text) => ctx.reply(
  text,
  Extra
    .load({
      reply_to_message_id: ctx.message.message_id,
      parse_mode: 'HTML',
    })
    .markup(Markup
      .removeKeyboard(true)
      .selective(true)
    )
);

const show = ctx => {
  const { id } = ctx.message.from;
  const reply = answer.bind(null, ctx);
  const country = getCountry(getStates(id).showlaw);
  if (!country) {
    reply(text(0) + text(1));
    setState(id, 'showlaw', null);
    return;
  }
  const lawlist = country.laws;
  const list = Object.keys(lawlist)
    .filter(law => !law.WIP);
  if (list.length < 1) {
    reply(text(2));
    setState(id, 'showlaw', null);
    return;
  }
  const law = ctx.message.text;
  if (law === text(6)) {
    reply(text(0) + text(7));
    setState(id, 'showlaw', null);
    return;
  }
  if (!list.includes(law)) {
    reply(text(0) + text(3));
    setState(id, 'showlaw', null);
    return;
  }

  reply(
    text(4).replace('{name}', law) +
    `<b>${country.name}</b>` +
    text(5).replace('{date}', lawlist[law].date) +
    lawlist[law].text
  );
  setState(id, 'showlaw', null);
};

module.exports = show;
