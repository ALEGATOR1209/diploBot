'use strict';

//Telegraf stuff
const Telegraf = require('telegraf');
const TOKEN = require('./token');
const imports = require('../imports');
const bot = new Telegraf(TOKEN);

bot.start(ctx => ctx.reply('Hi!'));
bot.help(ctx => ctx.reply('`No help.`'));
const setCommands = commands => commands.forEach(command =>
  bot.command(command, imports.countryBot.commands(command))
);
const commands = [ /* asterisk comments marks command for admins */
  'whereami',      //shows info about current citizenship
  'addcountry',    /* create new country in current chat */
  'rmcountry',     /* delete country in current chat */
  'rightslist',    //list of all in-game rights
  'rights',        //list of player's personal rights
  'getpassport',   //get citizenship of current chat country
  'droppassport',  //became stateless
  'kill',          //try to assassinate someone in hidden way
  'shoot',         //try to make public assassination attempt
  'sendmessage',   /* send message from bot's name to some chat */
  'addclass',      //create subclass of player's current class
  'classlist',     //show all classes of player's country
  'showclass',     //show info about player's class
  'changeclass',   //change one of player's class subclasses
  'deport',        //deport user from the country
  'deleteclass',   //delete one of player's class subclasses
  'migrantclass',  //set default class for new players
  'revolution',    //start a revolution
  'arrest',        //arrest player
  'free',          //liberate player
  'execute',       //execute prisoner
  'blacklist',     //list of banned users
  'opendoors',     //remove users from blacklist
  'laws',          //list of laws
  'addlaw',        //add a law to lawlist
  'rmlaw',         //remove law from lawlist
  //TODO: send army orders             'sendorders'
  //TODO: show last orders             'showorders'
  //TODO: *ADMINS* show country orders 'orders'
  //TODO: *ADMINS* start new turn      'turn'
];

setCommands(commands);
bot.on('text', imports.countryBot.commands('handleText'));
bot.on('new_chat_members', imports.countryBot.commands('newCitizens'));

const setActions = actions => actions.forEach(action =>
  bot.action(action, imports.countryBot.actions(action))
);
const actions = [
  'revolt',      //support rebels
  'reaction',    //support government
];
setActions(actions);

bot.catch(console.log);
bot.launch();
