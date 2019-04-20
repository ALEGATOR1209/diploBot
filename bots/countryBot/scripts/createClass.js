'use strict';

const {
  getStates,
  setState,
  findUser,
  getAllRights: rightslist,
  newClass,
  removeClass,
  getText,
} = require('../../imports').few('countryBot', 'scripts',
  [
    'getStates',
    'setState',
    'findUser',
    'getAllRights',
    'newClass',
    'removeClass',
    'getText',
  ]);
const text = t => getText('createClass')[t];

const stateHandlers = {
  'enteringName': ctx => {
    const { text: messageText } = ctx.message;
    const { username, id } = ctx.message.from;
    const tag = username || id;
    const country  = findUser(tag);

    if (messageText.match(/^cancel$/gi)) {
      setState(id, 'creatingClass', null);
      ctx.reply(text(1));
      return;
    }

    newClass(country.chat, messageText, {
      creator: id,
      parentClass: country.citizens[tag].class,
    });

    setState(id, 'creatingClass', 'enteringRights');
    ctx.reply(
      text(2) + rightslist.reduce(
        (acc, val, i) => acc + `${i + 1} - ${val}\n`, ''
      )
    );
  },

  'enteringRights': ctx => {
    const { text: messageText } = ctx.message;
    const { username, id } = ctx.message.from;
    const tag = username || id;
    const country  = findUser(tag);
    const className = Object.keys(country.classes)
      .find(cLaSS => country.classes[cLaSS].creator === id);

    if (messageText.match(/^cancel$/gi)) {
      setState(id, 'creatingClass', null);
      removeClass(country.chat, className);
      ctx.reply(text(3));
      return;
    }

    const rights = messageText
      .split(' ')
      .map(string => parseInt(string) - 1)
      .sort((a, b) => (a >= b ? 1 : -1))
      .reduce((acc, val) => (acc.includes(val) ? acc : [...acc, val]), []);

    const playersClass = country.classes[country.citizens[tag].class].rights;
    const classRights = [];
    newClass(country.chat, className, {
      rights: rights.reduce(
        (acc, val) => {
          if (!playersClass.includes(rightslist[val])) {
            ctx.reply(
              text(12) + rightslist[val],
              { reply_to_message_id: ctx.message.message_id }
            );
            return acc;
          }
          classRights.push(rightslist[val]);
          return [...acc, rightslist[val]];
        }, []),
    });

    setState(id, 'creatingClass', 'enteringNumber');
    ctx.reply(
      text(4) +
      rightslist.reduce(
        (acc, val) => acc +
          ((classRights.includes(val) ? '✅ ' : '❌ '
          ) + `${val}\n`), ''
      ) + text(5),
      { reply_to_message_id: ctx.message.message_id }
    );
  },

  'enteringNumber': ctx => {
    const { text: messageText } = ctx.message;
    const { username, id } = ctx.message.from;
    const tag = username || id;
    const country  = findUser(tag);
    const userClass = Object.keys(country.classes)
      .find(key => country.classes[key].creator === id);

    if (messageText.match(/^cancel$/gi)) {
      setState(id, 'creatingClass', null);
      removeClass(country.chat, userClass);
      ctx.reply(text(3));
      return;
    }

    if (messageText.match(/^[-‒–—―]$/g)) {
      setState(id, 'creatingClass', 'enteringRights');
      ctx.reply(
        text(2) +
        rightslist.reduce((acc, val, i) => acc + `${i + 1} - ${val}\n`, '')
      );
      return;
    }

    if (messageText.match(/^[0-9]*$/)) {
      const number = parseInt(messageText);
      if (number < 0) {
        ctx.reply(text(6), { reply_to_message_id: ctx.message.message_id });
        return;
      }

      if (number === 0)
        ctx.reply(text(7), { reply_to_message_id: ctx.message.message_id });
      else ctx.reply(
        text(8) + number,
        { reply_to_message_id: ctx.message.message_id }
      );

      newClass(country.chat, userClass, {
        number,
      });
      setState(id, 'creatingClass', 'confirmation');
      ctx.reply(text(9));
      return;
    }
    ctx.reply(text(10), { reply_to_message_id: ctx.message.message_id });
  },
  'confirmation': ctx => {
    const { text: messageText } = ctx.message;
    const { username, id } = ctx.message.from;
    const tag = username || id;
    const country  = findUser(tag);
    const userClass = Object.keys(country.classes)
      .find(key => country.classes[key].creator === id);

    if (messageText.match(/^cancel$/gi)) {
      setState(id, 'creatingClass', null);
      removeClass(country.chat, userClass);
      ctx.reply(text(3));
      return;
    }

    if (messageText.match(/^\+$/g)) {
      setState(id, 'creatingClass', null);
      newClass(country.chat, userClass, { creator: null });
      ctx.reply(text(11));
      return;
    }

    if (messageText.match(/^-$/g)) {
      setState(id, 'creatingClass', 'enteringNumber');
      ctx.reply(text(5));
      return;
    }

    ctx.reply('Wrong input');
  },
};

const createClass = ctx => stateHandlers[
  getStates(ctx.message.from.id).creatingClass
](ctx);

module.exports = createClass;
