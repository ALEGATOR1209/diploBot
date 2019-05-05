'use strict';

//Telegraf stuff
const Telegraf = require('telegraf');
const TOKEN = require('./token');
const imports = require('../imports');
const bot = new Telegraf(TOKEN);

//Initializing databases
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

low(new FileSync('./databases/graveyard.json'))
  .defaults({ cemetery: {} })
  .write();

low(new FileSync('./databases/countries.json'))
  .defaults({ countries: {} })
  .write();

low(new FileSync('./databases/states.json'))
  .defaults({})
  .write();

low(new FileSync('./databases/game.json'))
  .defaults({
    'turn': 0,
    'deathTime': 5,
    'gameChannel': '@ceppelinBE',
  })
  .write();

bot.start(ctx => ctx.reply('Hi!'));
bot.help(ctx => ctx.reply('`No help.`'));

const setCommands = commands => commands.forEach(command =>
  bot.command(command, imports.countryBot.commands(command))
);

const commands = [ /* asterisk comments marks command for admins */
  // 'whereami',      //shows info about current citizenship
  // 'addcountry',    /* create new country in current chat */
  // 'rmcountry',     /* delete country in current chat */
  // 'rightslist',    //list of all in-game rights
  // 'rights',        //list of player's personal rights
  'getpassport',   //get citizenship of current chat country
  // 'droppassport',  //became stateless
  // 'kill',          //try to assassinate someone in hidden way
  // 'shoot',         //try to make public assassination attempt
  // 'sendmessage',   /* send message from bot's name to some chat */
  // 'addclass',      //create subclass of player's current class
  // 'classlist',     //show all classes of player's country
  // 'showclass',     //show info about player's class
  // 'changeclass',   //change one of player's class subclasses
  // 'deport',        //deport user from the country
  // 'deleteclass',   //delete one of player's class subclasses
  // 'migrantclass',  //set default class for new players
  // 'revolution',    //start a revolution
  // 'arrest',        //arrest player
  // 'free',          //liberate player
  // 'execute',       //execute prisoner
  // 'blacklist',     //list of banned users
  // 'opendoors',     //remove users from blacklist
  // 'laws',          //list of laws
  // 'addlaw',        //add a law to lawlist
  // 'rmlaw',         //remove law from lawlist
  // 'sendorders',    //send army orders
  // 'showorders',    //show last orders
  // 'setadminschat', /* sets this chat as admin chat */
  // 'orders',        /* show country orders */
  // 'panic',         //reset state and remove keyboards
  // 'turn',          /* start new turn */
  // 'dead',          /* check list of dead people */
];

setCommands(commands);
bot.on('message', imports.countryBot.commands('handleText'));

const setActions = actions => actions.forEach(action =>
  bot.action(action, imports.countryBot.actions(action))
);
const actions = [
  // 'revolt',      //support rebels
  // 'reaction',    //support government
];

setActions(actions);

bot.catch(e => console.log('\x1b[0;31mERROR:\x1b[0m', e, '\n'));
bot.launch();
