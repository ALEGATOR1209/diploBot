'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  findUser,
  getText,
  setState,
  getGame,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'setState',
    'getGame',
  ]);
const text = t => getText('rmlaw')[t];

const rmlaw = ctx => {
  if (getGame('turn') === 0) {
    ctx.reply(getText('0turnAlert'));
    return;
  }
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (getAdmins().includes(tag)) {
    ctx.reply(text(0) + text(1), reply);
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(0) + text(2), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(8), reply);
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на принятие законов')) {
    ctx.reply(text(0) + text(3), reply);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(0) + text(4), reply);
    return;
  }

  const lawlist = Object.keys(country.laws)
    .filter(law => !country.laws[law].WIP);
  if (lawlist.length < 1) {
    ctx.reply(text(0) + text(7), reply);
    return;
  }
  lawlist.push(text(6));
  setState(id, 'removingLaw', country.chat);
  ctx.reply(
    text(0) +
    text(5),
    Extra
      .load(reply)
      .markup(Markup.keyboard(lawlist)
        .oneTime()
        .resize()
        .selective(true)
      )
  );
};

module.exports = rmlaw;
