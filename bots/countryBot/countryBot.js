'use strict';

//Telegraf stuff
const Telegraf = require('telegraf');
const TOKEN = require('./token');

//Commands scripts
const addcountry = require('./scripts/addcountry');
const rmcountry = require('./scripts/rmcountry');
const whereami = require('./scripts/whereami');
const handleText = require('./scripts/handleText');
const newCititzens = require('./scripts/newCititzens');

const bot = new Telegraf(TOKEN);

bot.start(ctx => ctx.reply('Hi!'));
bot.help(ctx => ctx.reply('`No help.`'));

bot.command('whereami', whereami);
bot.command('addcountry', addcountry);
bot.command('rmcountry', rmcountry);
bot.on('text', handleText);
bot.on('new_chat_members', newCititzens);

bot.catch(console.log);
bot.launch();
