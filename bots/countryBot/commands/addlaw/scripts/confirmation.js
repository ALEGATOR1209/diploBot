'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  getAdmins,
  findUser,
  getText,
  setState,
  setLaw,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getAdmins',
    'findUser',
    'getText',
    'setState',
    'setLaw',
  ]);
const text = t => getText('addlaw')[t];

const confirmation = ctx => {
  const { id } = ctx.message.from;
  const reply = { reply_to_message_id: ctx.message.message_id };
  if (getAdmins().includes(id)) {
    ctx.reply(text(0) + text(1), Extra
      .load(reply)
      .markup(Markup
        .removeKeyboard(true)
        .selective(true)
      )
    );
    setState(id, 'addingLaw', null);
    return;
  }

  const country = findUser(id);
  if (!country) {
    ctx.reply(text(0) + text(2), Extra
      .load(reply)
      .markup(Markup
        .removeKeyboard(true)
        .selective(true)
      )
    );
    setState(id, 'addingLaw', null);
    return;
  }
  if (country.hasRevolution) {
    ctx.reply(text(0) + text(12), Extra
      .load(reply)
      .markup(Markup
        .removeKeyboard(true)
        .selective(true)
      )
    );
    setState(id, 'addingLaw', null);
    return;
  }

  const userClassName = country.citizens[id].class;
  const userClass = country.classes[userClassName];
  if (!userClass.rights.includes('ADOPTING_LAWS')) {
    ctx.reply(text(0) + text(3), Extra
      .load(reply)
      .markup(Markup
        .removeKeyboard(true)
        .selective(true)
      )
    );
    setState(id, 'addingLaw', null);
    return;
  }
  if (country.citizens[id].inPrison) {
    ctx.reply(text(0) + text(4), Extra
      .load(reply)
      .markup(Markup
        .removeKeyboard(true)
        .selective(true)
      )
    );
    setState(id, 'addingLaw', null);
    return;
  }

  const messageText = ctx.message.text;
  const lawName = Object.keys(country.laws)
    .find(law => country.laws[law].WIP === id);
  const law = country.laws[lawName];

  if (messageText === text(6)) {
    ctx.reply(text(0) + text(9), Extra
      .load(reply)
      .markup(Markup.removeKeyboard(true).selective(true))
    );
    setState(id, 'addingLaw', null);
    law.WIP = undefined;
    setLaw(country.chat, lawName, law);
    return;
  }

  if (messageText === text(7)) {
    ctx.reply(text(0) + text(10), Extra
      .load(reply)
      .markup(Markup
        .removeKeyboard(true)
        .selective(true)
      )
    );
    setState(id, 'addingLaw', null);
    setLaw(country.chat, lawName, null);
    return;
  }

  ctx.reply(text(0) + text(10), Extra
    .load(reply)
    .markup(Markup
      .removeKeyboard(true)
      .selective(true)
    )
  );
};

module.exports = confirmation;
