'use strict';

const {
  getAdmins,
  findUser,
  getText,
  getDead,
  setState,
  setOrders,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'getDead',
    'setState',
    'setOrders',
  ]);
const text = t => getText('sendOrders')[t];

const sendOrders = ctx => {
  const { username, id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  const tag = username || id;
  if (getAdmins().includes(tag)) {
    ctx.reply(text(1), reply);
    return;
  }

  if (getDead(tag)) {
    ctx.reply(text(2), reply);
    return;
  }
  const country = findUser(tag);
  if (!country) {
    ctx.reply(text(3), reply);
    return;
  }

  const userClassName = country.citizens[tag].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('Право на управление армией')) {
    ctx.reply(text(4), reply);
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
  ctx.reply(text(5), reply);
};

module.exports = sendOrders;
