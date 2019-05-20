'use strict';

const {
  getAdmins,
  findUser,
  getText,
  getDead,
  setState,
  setOrders,
  getAdminsChat,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'getDead',
    'setState',
    'setOrders',
    'getAdminsChat',
  ]);
const showorders = require('../../../../imports')
  .countryBot
  .commands('showorders');
const text = t => getText('sendorders')[t];

const enteringOrders = ctx => {
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (getAdmins().includes(id)) {
    ctx.reply(text(0) + text(1), reply);
    setState(id, 'sendorders', null);
    return;
  }

  if (getDead(id)) {
    ctx.reply(text(0) + text(2), reply);
    setState(id, 'sendorders', null);
    return;
  }
  const country = findUser(id);
  if (!country) {
    ctx.reply(text(0) + text(3), reply);
    setState(id, 'sendorders', null);
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('COMMAND_ARMIES')) {
    ctx.reply(text(0) + text(4), reply);
    setState(id, 'sendorders', null);
    return;
  }

  const {
    text: messageText,
    photo,
    video,
    voice,
    caption,
    sticker,
    document,
    audio,
  } = ctx.message;

  setOrders(country.chat, {
    text: messageText,
    photo: photo ?
      photo.sort((a, b) => (a.size < b.size ? 1 : -1))[0].file_id :
      undefined,
    caption,
    document,
    voice,
    sticker,
    video,
    audio,
  });
  setState(id, 'sendorders', null);
  ctx.reply(text(0) + text(6), reply).then(() => {
    ctx.message.chat.id = getAdminsChat();
    showorders(ctx);
  });
};

module.exports = enteringOrders;
