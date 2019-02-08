'use strict';

const getStates = require('./getStates');
const setState = require('./setState');
const findUser = require('./findUser');
const rightslist = require('./getAllRights');
const newClass = require('./newClass');
const removeClass = require('./removeClass');

const stateHandlers = {
  'enteringName': ctx => {
    const { text } = ctx.message;
    const { username, id } = ctx.message.from;
    const tag = username || id;
    const country  = findUser(tag);

    if (text.match(/^cancel$/gi)) {
      setState(id, 'creatingClass', null);
      ctx.reply('Class creating canceled.');
      return;
    }

    newClass(country.chat, text, {
      creator: id,
      rules: [],
      parentClass: country.citizens[tag].class,
    });

    setState(id, 'creatingClass', 'enteringRights');
    ctx.reply(
      'Enter numbers you want add to your class in following format' +
      '\nnum1 num2 num3\n\n' + 'Rights:\n\n' +
      rightslist.reduce((acc, val, i) => acc + `${i + 1} - ${val}\n`, '')
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
      ctx.reply('Class creating canceled.');
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
      'Your class will have following rights:\n\n' +
      rightslist.reduce((acc, val) => acc + ((rights.includes(rightslist.indexOf(val) + 1) ? '✅ ' : '❌ ') + `${val}\n`), '') +
      '\n\nEnter max number of people for this class (0 = infinity) or cancel to abort.',
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
      ctx.reply('Class creating canceled.');
      return;
    }

    if (text.match(/^[‒–—―]$/g)) {
      setState(id, 'creatingClass', 'enteringRights');
      ctx.reply(
        'Enter numbers of rights you want add to your class in following format:' +
        '\nnum1 num2 num3\n\n' + 'Rigths:\n\n' +
        rightslist.reduce((acc, val, i) => acc + `${i + 1} - ${val}\n`, '')
      );
      return;
    }

    if (text.match(/^[0-9]*$/)) {
      const number = parseInt(text);
      if (number < 0) {
        ctx.reply('Wrong number, try again.', { reply_to_message_id: ctx.message.message_id });
        return;
      }

      if (number === 0)
        ctx.reply('Class unlimited.', { reply_to_message_id: ctx.message.message_id });
      else ctx.reply(`Max size of class is ${number} people.`, { reply_to_message_id: ctx.message.message_id });

      newClass(country.chat, userClass, {
        number,
      });
      setState(id, 'creatingClass', 'confirmation');
      ctx.reply('Enter + to confirm creation, - to return to previous step and cancel to decline.');
      return;
    }
    ctx.reply('Wrong input, try again.', { reply_to_message_id: ctx.message.message_id });
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
      ctx.reply('Class creating canceled.');
      return;
    }

    if (text.match(/^\+$/g)) {
      setState(id, 'creatingClass', null);
      newClass(country.chat, userClass, { creator: null });
      ctx.reply('Class successfully created!');
      return;
    }

    if (text.match(/^-$/g)) {
      setState(id, 'creatingClass', 'enteringNumber');
      ctx.reply('Enter max number of people for this class (0 = infinity) or cancel to abort.');
      return;
    }

    ctx.reply('Wrong input');
  },
};

const createClass = ctx => stateHandlers[
  getStates(ctx.message.from.id).creatingClass
](ctx);

module.exports = createClass;
