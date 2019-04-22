'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  setState,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'setState',
  ]);
const text = t => getText('opendoors')[t];

const opendoors = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (!country) {
    ctx.reply(
      text(1),
      reply
    );
    return;
  }
  const userClass = country.classes[
    country
      .citizens[tag]
      .class
  ];
  if (!userClass.rights.includes('Право изгонять из страны')) {
    ctx.reply(
      text(2),
      reply
    );
    return;
  }

  const blacklist = country.blacklist;
  if (!blacklist) {
    ctx.reply(
      text(3),
      reply
    );
    return;
  }

  const list = Object.keys(blacklist);
  list.push(text(5));
  list.push(text(6));
  ctx.reply(
    text(4),
    Extra
      .load(reply)
      .markup(Markup.keyboard(list))
  );
  setState(id, 'choosingPeopleToUnban', []);
};

module.exports = opendoors;
