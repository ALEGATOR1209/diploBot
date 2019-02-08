'use strict';

const getStates = require('./getStates');
const setState = require('./setState');
const findUser = require('./findUser');
const rightslist = require('./getAllRights');
const newClass = require('./newClass');
const removeClass = require('./removeClass');
const getText = text => require('./getText')(`createClass.${text}`);

const stateHandlers = {
  'enteringName': ctx => {
    const { text } = ctx.message;
    const { username, id } = ctx.message.from;
    const tag = username || id;
    const country  = findUser(tag);

    if (text.match(/^cancel$/gi)) {
      setState(id, 'creatingClass', null);
      ctx.reply(getText(1));
      return;
    }

    newClass(country.chat, text, {
      creator: id,
      rules: [],
      parentClass: country.citizens[tag].class,
    });

    setState(id, 'creatingClass', 'enteringRights');
    ctx.reply(
      getText(2) + rightslist.reduce(
        (acc, val, i) => acc + `${i + 1} - ${val}\n`, ''
      )
    );
  },

  'enteringRights': ctx => {
    const { text } = ctx.message;
    const { username, id } = ctx.message.from;
    const tag = username || id;
    const country  = findUser(tag);
    const className = Object.keys(country.classes)
      .find(cLaSS => country.classes[cLaSS].creator === id);

    if (text.match(/^cancel$/gi)) {
      setState(id, 'creatingClass', null);
      removeClass(country.chat, className);
      ctx.reply(getText(3));
      return;
    }

    const rights = text
      .split(' ')
      .map(string => parseInt(string))
      .sort((a, b) => (a >= b ? 1 : -1))
      .reduce((acc, val) => (acc.includes(val) ? acc : [...acc, val]), []);

    newClass(country.chat, className, {
      rights: rights.reduce(
        (acc, val) => (rightslist[val - 1] ?
          [...acc, rightslist[val - 1]] : acc), []),
    });

    setState(id, 'creatingClass', 'enteringNumber');
    ctx.reply(
      getText(4) +
      rightslist.reduce((acc, val) => acc + ((rights.includes(rightslist.indexOf(val) + 1) ? '✅ ' : '❌ ') + `${val}\n`), '') +
      + '\n\n' + getText(5),
      { reply_to_message_id: ctx.message.message_id }
    );
  },

  'enteringNumber': ctx => {
    const { text } = ctx.message;
    const { username, id } = ctx.message.from;
    const tag = username || id;
    const country  = findUser(tag);
    const userClass = Object.keys(country.classes)
      .find(key => country.classes[key].creator === id);

    if (text.match(/^cancel$/gi)) {
      setState(id, 'creatingClass', null);
      removeClass(country.chat, userClass);
      ctx.reply(getText(3));
      return;
    }

    if (text.match(/^[‒–—―]$/g)) {
      setState(id, 'creatingClass', 'enteringRights');
      ctx.reply(
        getText(2) +
        rightslist.reduce((acc, val, i) => acc + `${i + 1} - ${val}\n`, '')
      );
      return;
    }

    if (text.match(/^[0-9]*$/)) {
      const number = parseInt(text);
      if (number < 0) {
        ctx.reply(getText(6), { reply_to_message_id: ctx.message.message_id });
        return;
      }

      if (number === 0)
        ctx.reply(getText(7), { reply_to_message_id: ctx.message.message_id });
      else ctx.reply(getText(8) + number, { reply_to_message_id: ctx.message.message_id });

      newClass(country.chat, userClass, {
        number,
      });
      setState(id, 'creatingClass', 'confirmation');
      ctx.reply(getText(9));
      return;
    }
    ctx.reply(getText(10), { reply_to_message_id: ctx.message.message_id });
  },
  'confirmation': ctx => {
    const { text } = ctx.message;
    const { username, id } = ctx.message.from;
    const tag = username || id;
    const country  = findUser(tag);
    const userClass = Object.keys(country.classes)
      .find(key => country.classes[key].creator === id);

    if (text.match(/^cancel$/gi)) {
      setState(id, 'creatingClass', null);
      removeClass(country.chat, userClass);
      ctx.reply(getText(3));
      return;
    }

    if (text.match(/^\+$/g)) {
      setState(id, 'creatingClass', null);
      newClass(country.chat, userClass, { creator: null });
      ctx.reply(getText(11));
      return;
    }

    if (text.match(/^-$/g)) {
      setState(id, 'creatingClass', 'enteringNumber');
      ctx.reply(getText(5));
      return;
    }

    ctx.reply('Wrong input');
  },
};

const createClass = ctx => stateHandlers[
  getStates(ctx.message.from.id).creatingClass
](ctx);

module.exports = createClass;
