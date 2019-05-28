'use strict';

const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const imports = require('./imports');
const Logger = require('./logger');

//Charon - system messages transportation between Telegram API and commands
class Charon {
  constructor(bot) {
    this.bot = bot;
    this.logger = new Logger('game.log', 'err.log');
  }
  commands(commands) {
    for (const command of commands) {
      this.bot.command(
        command,
        ctx => this.execute(ctx, 'commands', command)
      );
    }
    return this;
  }
  actions(actions) {
    for (const action of actions) {
      this.bot.action(
        action,
        ctx => this.execute(ctx, 'actions', action)
      );
    }
    return this;
  }
  static fromToken(token) {
    return new Charon(new Telegraf(token));
  }
  initBases() {
    imports.scripts('initBases')();
    return this;
  }
  on(message, fn) {
    this.bot.on(message, ctx => this.execute(ctx, 'commands', fn));
    return this;
  }
  launch(options) {
    this.bot.launch(options);
    return this;
  }
  static get(files) {
    const types = Object.keys(imports);
    const lib = {};

    for (const file of files) {
      let imported;
      for (const type of types) {
        try {
          imported = imports[type](file);
        } catch (e) { /* */ }
      }
      if (!imported) throw new Error(`Cannot find module: ${file}`);
      lib[file] = imported;
    }
    return lib;
  }
  async execute(ctx, type, fn) {
    const messenger = ctx.update.callback_query || ctx.message;
    const { id, username } = messenger.from;
    const report = {
      id,
      username,
      input: ctx.message.text,
      command: fn,
      date: new Date()
    };

    try {
      const getPlayers = imports.scripts('getPlayers');
      const setPlayer = imports.scripts('setPlayer');
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

      await imports[type](fn)(charon);
    } catch (error) {
      const getText = imports.scripts('getText');

      Charon.reply(
        ctx,
        'reply',
        getText('botError')
          .replace('{error}', error),
      );
      imports.scripts('setState')(messenger.from.id, '', null);
      report.error = error;
    }
    this.logger
      .log(report);
  }
  static reply(ctx, type, text, keyboard, options) {
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
  async parseEntities(text, entities) {
    const getPlayers = imports.scripts('getPlayers');
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
        if (player.isBot) continue;
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
