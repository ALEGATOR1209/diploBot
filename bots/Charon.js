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
    const messanger = ctx.update.callback_query || ctx.message;
    try {
      const getPlayers = imports.countryBot.scripts('getPlayers');
      const setPlayer = imports.countryBot.scripts('setPlayer');
      const { id } = messanger.from;
      if (!getPlayers().includes(id)) setPlayer(id);

      let mentions;
      if (!ctx.update.callback_query) {
        const { text, entities } = ctx.update.message;
        mentions = entities ?
          await this.parseEntities(text, entities) : undefined;
      }

      const charon = {
        reply: Charon.reply.bind(null, ctx, 'reply'),
        editMessageText: Charon.reply.bind(null, ctx, 'editMessageText'),
        replyWithPhoto: Charon.reply.bind(null, ctx, 'replyWithPhoto'),
        replyWithAudio: Charon.reply.bind(null, ctx, 'replyWithAudio'),
        replyWithDocument: Charon.reply.bind(null, ctx, 'replyWithDocument'),
        replyWithSticker: Charon.reply.bind(null, ctx, 'replyWithSticker'),
        replyWithVideo: Charon.reply.bind(null, ctx, 'replyWithVideo'),
        replyWithVideoNote: Charon.reply.bind(null, ctx, 'replyWithVideoNote'),
        replyWithVoice: Charon.reply.bind(null, ctx, 'replyWithVoice'),
        answerCbQuery: ctx.answerCbQuery,
        get: Charon.get,
        message: ctx.update.message,
        chat: ctx.chat,
        getChat: this.getChat.bind(this),
        update: ctx.update,
        mentions,
      };

      await imports.countryBot[type](fn)(charon);
    } catch (e) {
      const getText = imports
        .countryBot
        .scripts('getText');

      Charon.reply( //we must say user that error has occured
        ctx,
        'reply',
        getText('botError')
          .replace('{error}', e),
      );

      imports //clearing user states
        .countryBot
        .scripts('setState')(messanger.from.id, '', null);

      console.error(e);
    }
  }
  static reply(ctx, type, text, keyboard, options) { //reply to user
    return ctx[type](
      text,
      Extra
        .load(options || {
          reply_to_message_id: ctx.message ? ctx.message.message_id : undefined,
        })
        // eslint-disable-next-line new-cap
        .HTML()
        .markup(Charon.resolveMarkup(keyboard))
    );
  }
  static resolveMarkup(keyboard) {
    let buttons = keyboard ? keyboard.buttons : undefined;
    const type = buttons ? (keyboard.type || 'keyboard') : undefined;
    if (type === 'inlineKeyboard') {
      buttons = buttons.map(el => Markup.callbackButton(el.text, el.action));
    }
    const markup = type ?
      Markup[type](buttons)
        .oneTime()
        .resize() :
      Markup
        .removeKeyboard(true);
    markup.selective_keyboard = true;
    return markup;
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
  async getChat(id) {
    return await this.bot
      .telegram
      .getChat(id);
  }
}

module.exports = Charon;
