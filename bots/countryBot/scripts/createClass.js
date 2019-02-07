'use strict';

const getStates = require('./getStates');
const setState = require('./setState');
const findUser = require('./findUser');
const rightslist = require('./getAllRights');

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

    /*newClass(text, {
      creator: id,
      rules: [],
      parentClass: country.citizens[tag].class,
    });*/

    setState(id, 'creatingClass', 'enteringRights');
    console.log(getStates(id));
    ctx.reply(
      'Enter numbers of rights you want add to your class in following format:' +
      '\nnum1\nnum2\nnum3\n\n' + 'Rigths:\n\n' +
      rightslist.reduce((acc, val, i) => acc + `${i + 1} - ${val}\n`, '')
    );
  },
  "enteringRights": ctx => {
    const { text } = ctx.message;
    const { username, id } = ctx.message.from;
    const tag = username || id;
    const country  = findUser(tag);

    if (text.match(/^cancel$/gi)) {
      setState(id, 'creatingClass', null);
      ctx.reply('Class creating canceled.');
      return;
    }

    const rights = text
      .split('\n')
      .map(string => parseInt(string))
      .sort((a, b) => a >= b ? 1 : -1)
      .reduce((acc, val) => acc.includes(val) ? acc : [...acc, val], [])

    ctx.reply(
      'Your class will have following rights:\n\n' +
      rightslist.reduce((acc, val) => acc + ((rights.includes(rightslist.indexOf(val) + 1) ? '✅ ' : '❌ ') + `${val}\n`), '') +
      '\n\nEnter + to confirm creation of class, - to decline and cancel to abort.',
      { reply_to_message_id: ctx.message.message_id }
    )
  },
};

const createClass = ctx => stateHandlers[getStates(
  ctx.message.from.id

).creatingClass](ctx);

module.exports = createClass;
