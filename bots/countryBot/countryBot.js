'use strict';

const Telegraf = require('telegraf');
const TOKEN = require('./token');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const bot = new Telegraf(TOKEN);
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ 
  admins: [ 'alegator1209' ],
  countries: [ 'Yermany', 'Ucraina' ],
}).write();

bot.start(ctx => ctx.reply('Hi!'));
bot.help(ctx => ctx.reply('`No help.`'));

/*
  Adds new admin
  Usage examples: 
    /addadmin @username
    /addadmin username
*/
bot.command('addadmin', ctx => {
  const user = ctx.message.from.username;
  const adminlist = db.get('admins');

  if (adminlist.value().includes(user)) {
    const newAdmin = ctx.message.text
      .slice('/addadmin'.length)
      .trim()
      .match(/[^@]+/)[0];
    if (adminlist.value().includes(newAdmin)) {
      ctx.reply('This user is already an admin');
      return;
    }

    adminlist.push(newAdmin).write();
    ctx.reply('Admin added.');
    ctx.reply('Full adminlist:\n@' + adminlist.value().join('\n@'));
    return;
  }
  ctx.reply('You have no rigths');
});

/*
  Removes admin
  Usage examples:
    /rmadmin @username
    /rmadmin username
*/
bot.command('rmadmin', ctx => {
  const user = ctx.message.from.username;
  const adminlist = db.get('admins');

  if (adminlist.value().includes(user)) {
    const exAdmin = ctx.message.text
      .slice('/rmadmin'.length)
      .trim()
      .match(/[^@]+/)[0];
    if (exAdmin === 'alegator1209') {
      ctx.reply('Can\'t remove Great Creator.');
      return;
    }
    if (!adminlist.value().includes(exAdmin)) {
      ctx.reply('This user has no admin rigths.');
      return;
    }

    const newAdminlist = adminlist.value()
      .filter(admin => admin !== exAdmin);
    db.set('admins', newAdminlist)
      .write();
    ctx.reply('Admin removed.');
    ctx.reply('Full adminlist:\n@' + adminlist.value().join('\n@'));
    return;
  }
  ctx.reply('You have no rigths');
});

bot.launch();
