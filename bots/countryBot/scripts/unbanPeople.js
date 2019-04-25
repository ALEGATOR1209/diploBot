'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  setState,
  getStates,
  unban,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'setState',
    'getStates',
    'unban',
  ]);
const text = t => getText('opendoors')[t];

const unbanPeople = ctx => {
  const { username, id } = ctx.message.from;
  const tag = username || id;
  const country = findUser(tag);
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (!country) {
    ctx.reply(
      text(0) +
      text(1),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingPeopleToUnban', null);
    return;
  }
  const userClass = country.classes[
    country
      .citizens[tag]
      .class
  ];
  if (!userClass.rights.includes('Право изгонять из страны')) {
    ctx.reply(
      text(0) +
      text(2),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingPeopleToUnban', null);
    return;
  }

  const blacklist = country.blacklist;
  if (!blacklist) {
    ctx.reply(
      text(0) +
      text(3),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingPeopleToUnban', null);
    return;
  }

  const toUnban = getStates(id).choosingPeopleToUnban;
  const messageText = ctx.message.text;

  if (messageText === text(5)) {
    ctx.reply(
      text(0) +
      text(8),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    if (country.chat !== ctx.message.chat.username) {
      ctx.reply(text(8), { chat_id: `@${country.chat}` });
    }
    setState(id, 'choosingPeopleToUnban', null);
    unban(country.chat, toUnban);
    return;
  }
  if (messageText === text(6)) {
    ctx.reply(
      text(0) +
      text(9),
      Extra
        .load(reply)
        .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'choosingPeopleToUnban', null);
    return;
  }

  if (!Object.keys(blacklist).includes(messageText)) {
    ctx.reply(
      text(0) +
      text(7),
      Extra
        .load(reply)
        .markup(Markup.keyboard([
          text(5),
          text(6),
          ...toUnban
        ])
          .oneTime()
          .resize()
          .selective(true)
        )
    );
    return;
  }
  toUnban.push(messageText);
  const list = [
    text(5),
    text(6),
    ...Object.keys(blacklist)
      .filter(user => !toUnban.includes(user))
  ];
  ctx.reply(
    text(0) +
    text(4),
    Extra
      .load(reply)
      .markup(Markup.keyboard(list)
        .oneTime()
        .selective(true)
        .resize()
      )
  );

  setState(id, 'choosingPeopleToUnban', toUnban);
};

module.exports = unbanPeople;
