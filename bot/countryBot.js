'use strict';

const TOKEN = require('./token');
const Charon = require('./Charon');

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
  'deleteclass',   //delete one of player's class subclasses
  'migrantclass',  //set default class for new players0
  'deport',        //deport user from the country
  'opendoors',     //remove users from blacklist
  'arrest',        //arrest player
  'free',          //liberate player
  'execute',       //execute prisoner
  'blacklist',     //list of banned users
  'revolution',    //start a revolution
  'laws',          //list of laws
  'showlaw',       //show law
  'addlaw',        //add a law to lawlist
  'rmlaw',         //remove law from lawlist
  'sendorders',    //send army orders
  'showorders',    //show last orders
  'setadminschat', /* sets this chat as admin chat */
  'orders',        /* show country orders */
  'panic',         //reset state and remove keyboards
  'turn',          /* start new turn */
  'dead',          /* check list of dead people */
];

const actions = [
  'revolt',      //support rebels
  'reaction',    //support government
];

Charon.fromToken(TOKEN)
  .commands(commands)
  .actions(actions)
  .initBases()
  .on('message', 'handleText')
  .launch();
