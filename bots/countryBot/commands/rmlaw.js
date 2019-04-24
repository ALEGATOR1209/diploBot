'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  findUser,
  getText,
  setState,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'setState',
  ]);
const text = t => getText('rmlaw')[t];

const rmlaw = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (getAdmins().includes(tag)) {
    ctx.reply(text(1), reply);
    return;
  }

  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(2), reply);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(8), reply);
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на принятие законов')) {
    ctx.reply(text(3), reply);
    return;
  }
  if (country.citizens[tag].inPrison) {
    ctx.reply(text(4), reply);
    return;
  }

  const lawlist = Object.keys(country.laws)
    .filter(law => !country.laws[law].WIP);
  if (lawlist.length < 1) {
    ctx.reply(text(7), reply);
    return;
  }
  lawlist.push(text(6));
  setState(id, 'removingLaw', country.chat);
  ctx.reply(
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
