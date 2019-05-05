'use strict';

const {
  getAdmins,
  findUser,
  getText,
  getDead,
  setState,
  setOrders,
  getAdminsChat,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'getDead',
    'setState',
    'setOrders',
    'getAdminsChat',
  ]);
const showorders = require('../../imports').countryBot.commands('showorders');
const text = t => getText('sendOrders')[t];
const infoText = getText('sendorders')[0];

const sendOrders = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;
  if (getAdmins().includes(tag)) {
    ctx.reply(infoText + text(1), reply);
    setState(id, 'sendingOrders', null);
    return;
  }

  if (getDead(tag)) {
    ctx.reply(infoText + text(2), reply);
    setState(id, 'sendingOrders', null);
    return;
  }
  const country = findUser(tag);
  if (!country) {
    ctx.reply(infoText + text(3), reply);
    setState(id, 'sendingOrders', null);
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на управление армией')) {
    ctx.reply(infoText + text(4), reply);
    setState(id, 'sendingOrders', null);
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
  setState(id, 'sendingOrders', null);
  ctx.reply(infoText + text(5), reply).then(() => {
    ctx.message.chat.id = getAdminsChat();
    showorders(ctx);
  });
};

module.exports = sendOrders;
