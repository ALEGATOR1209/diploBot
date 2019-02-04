'use strict';

//Telegraf stuff
const Telegraf = require('telegraf');
const TOKEN = require('./token');

//Commands scripts
const addcountry = require('./scripts/addcountry');
const rmcountry = require('./scripts/rmcountry');

const bot = new Telegraf(TOKEN);

bot.start(ctx => ctx.reply('Hi!'));
bot.help(ctx => ctx.reply('`No help.`'));

bot.command('addcountry', addcountry);
bot.command('rmcountry', rmcountry);

bot.launch();
