'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {
  findUser,
  getText,
  getRevolutionDemands,
  setState,
  setRevolution,
  getAllRights: rightlist,
  rightsString,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'findUser',
    'getText',
    'getRevolutionDemands',
    'setState',
    'setRevolution',
    'getAllRights',
    'rightsString',
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

const choosingType = ctx => {
  const { id } = ctx.message.from;
  const reply = answer.bind(null, ctx);

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
    return;
  }
  if (country.hasRevolution) {
    reply(text(0) + text(4));
    setState(id, 'revolution', null);
    return;
  }

  const demands = ctx.message.text;
  if (demands.match(new RegExp(`^${getText('revolution')[5]}$`))) {
    reply(text(0) + text(7));
    setState(id, 'revolution', null);
    return;
  }

  const REVOLUTION_DEMANDS = getRevolutionDemands();
  const type = Object.keys(REVOLUTION_DEMANDS)
    .find(el => REVOLUTION_DEMANDS[el] === demands);

  if (!type) {
    reply(text(0) + text(8));
    setState(id, 'revolution', null);
    return;
  }

  const userClass = country
    .citizens[id]
    .class;
  const parentClass = country
    .classes[userClass]
    .parentClass;
  if (!parentClass) {
    reply(text(0) + text(9));
    setState(id, 'revolution', null);
    return;
  }
  const handleType = {
    'RIGHTS': () => {
      const rights = country.classes[parentClass]
        .rights
        .filter(el => !country
          .classes[userClass]
          .rights
          .includes(el)
        )
        .map(el => rightlist[el]);
      const otherRights = [
        text(12),
        text(5),
        ...rights,
      ];
      reply(
        text(0) +
        text(10) +
        text(21) +
        rightsString(country.classes[userClass].rights),
        Markup
          .keyboard(otherRights)
          .oneTime()
          .resize()
          .selective(true)
      );
      setState(id, 'revolution', 'choosingRights');
    },
    'CHANGE_PARENT': () => {
      const parents = Object.keys(country.classes)
        .filter(el =>
          el !== userClass &&
          el !== parentClass &&
          !country.classes[el].creator
        );
      if (parents.length < 1) {
        reply(text(0) + text(13));
        setState(id, 'revolution', null);
        return;
      }
      parents.push(text(5));
      reply(text(0) + text(11), Markup.keyboard(parents)
        .oneTime()
        .resize()
        .selective(true)
      );
      setState(id, 'revolution', 'choosingParent');
    }
  };
  const revolution = {
    type,
    revolter: userClass,
    rebels: [],
    reactioners: [],
  };
  setRevolution(country.chat, id, revolution);
  handleType[type]();
};

module.exports = choosingType;
