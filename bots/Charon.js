'use strict';

const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const imports = require('./imports');

//Charon - system messages transportation between Telegram API and commands
class Charon {
  constructor(bot) {
    this.bot = bot;
  }
  commands(commands) { //register commands in bot
    for (const command of commands) {
      this.bot.command(
        command,
        ctx => this.execute(ctx, 'commands', command)
      );
    }
    return this;
  }
  actions(actions) { //register actions in bot
    for (const action of actions) {
      this.bot.action(
        action,
        ctx => this.execute(ctx, 'actions', action)
      );
    }
    return this;
  }
  static fromToken(token) { //create a new bot from token
    return new Charon(new Telegraf(token));
  }
  initBases() { //init databases
    imports.countryBot.scripts('initBases')();
    return this;
  }
  on(message, fn) { //subscribe to bot event
    this.bot.on(message, ctx => this.execute(ctx, 'commands', fn));
    return this;
  }
  launch() { //launch bot
    this.bot.launch();
    return this;
  }
  static get(files) { //get some file by name
    const types = Object.keys(imports.countryBot);
    const lib = {};

    for (const file of files) {
      let imported;
      let error;
      for (const type of types) {
        try {
          imported = imports.countryBot[type](file);
        } catch (e) {
          error = e;
        }
      }
      if (!imported) throw error;
      lib[file] = imported;
    }
    return lib;
  }
  async execute(ctx, type, fn) { //execute script
    try {
      const { text, entities } = ctx.message;
      const mentions = entities ?
        await this.parseEntities(text, entities) : undefined;

      const charon = {
        reply: Charon.reply.bind(null, ctx),
        editMessageText: ctx.editMessageText,
        replyWithPhoto: ctx.replyWithPhoto,
        replyWithAudio: ctx.replyWithAudio,
        replyWithDocument: ctx.replyWithDocument,
        replyWithSticker: ctx.replyWithSticker,
        replyWithVideo: ctx.replyWithVideo,
        replyWithVideoNote: ctx.replyWithVideoNote,
        replyWithVoice: ctx.replyWithVoice,
        get: Charon.get,
        message: ctx.update.message,
        chat: ctx.chat,
        getChat: ctx.getChat,
        mentions,
      };

      await imports.countryBot[type](fn)(charon);
    } catch (e) {
      const getText = imports
        .countryBot
        .scripts('getText');

      Charon.reply( //we must say user that error has occured
        ctx,
        getText('botError')
          .replace('{error}', e),
      );

      imports //clearing user states
        .countryBot
        .scripts('setState')(ctx.message.from.id, '', null);

      console.error(e);
    }
  }
  static reply(ctx, text, keyboard, options) { //reply to user
    const buttons = keyboard ? keyboard.buttons : undefined;
    const type = buttons ? (keyboard.type || 'keyboard') : undefined;
    const markup = keyboard ?
      Markup[type](buttons)
        .oneTime()
        .resize() :
      Markup
        .removeKeyboard(true);
    markup.selective_keyboard = true;
    return ctx.reply(
      text,
      Extra
        .load(options || {
          reply_to_message_id: ctx.message_message_id,
        })
        .HTML()
        .markup(markup)
    );
  }
  //returns an array of user IDs and tags
  async parseEntities(text, entities) {
    const getPlayers = imports
      .countryBot
      .scripts('getPlayers');
    const players = getPlayers();
    const mentioned = [];

    for (const entity of entities) {
      if (entity.type !== 'mention') continue;
      const { length, offset } = entity;

      let tag = text.slice(offset, offset + length);
      if (tag[0] === '@') tag = tag.slice(1);

      for (const id of players) {
        const player = await this.bot
          .telegram
          .getChat(id);
        if (player.username === tag) mentioned.push({ id, username: tag });
      }
    }
    return mentioned;
  }
}

module.exports = Charon;
