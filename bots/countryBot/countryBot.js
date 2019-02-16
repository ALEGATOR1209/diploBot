'use strict';

//Telegraf stuff
const Telegraf = require('telegraf');
const TOKEN = require('./token');

//Commands scripts
const addcountry = require('./scripts/addcountry');
const rmcountry = require('./scripts/rmcountry');
const whereami = require('./scripts/whereami');
const handleText = require('./scripts/handleText');
const newCitizens = require('./scripts/newCitizens');
const removeCitizen = require('./scripts/removeCitizen');
const rightlist = require('./scripts/rightlist');
const rights = require('./scripts/rights');
const getpassport = require('./scripts/getpassport');
const droppassport = require('./scripts/droppassport');
const kill = require('./scripts/kill');
const shoot = require('./scripts/shoot');
const sendmessage = require('./scripts/sendmessage');
const classlist = require('./scripts/classlist');
const addclass = require('./scripts/addclass');
const showclass = require('./scripts/showclass');
const changeclass = require('./scripts/changeclass');
const deleteclass = require('./scripts/deleteclass');
const deport = require('./scripts/deport');

const bot = new Telegraf(TOKEN);

bot.start(ctx => ctx.reply('Hi!'));
bot.help(ctx => ctx.reply('`No help.`'));

bot.command('whereami', whereami);
bot.command('addcountry', addcountry);
bot.command('rmcountry', rmcountry);
bot.command('rightslist', rightlist);
bot.command('rights', rights);
bot.command('getpassport', getpassport);
bot.command('droppassport', droppassport);
bot.command('kill', kill);
bot.command('shoot', shoot);
bot.command('sendmessage', sendmessage);
bot.command('addclass', addclass);
bot.command('classlist', classlist);
bot.command('showclass', showclass);
bot.command('changeclass', changeclass);
bot.command('deport', deport);
bot.command('deleteclass', deleteclass);
bot.on('text', handleText);
bot.on('new_chat_members', newCitizens);
bot.on('left_chat_member', removeCitizen);

bot.catch(console.log);
bot.launch();
