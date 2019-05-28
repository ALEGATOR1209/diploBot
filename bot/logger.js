'use strict';

const { appendFile } = require('fs');
const COLORS = {
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  white: 7,
};

const draw = (text, color) => `\x1b[0;3${color}m${text}\x1b[0m`;

module.exports = class Logger {
  constructor(gamelog, errlog) {
    this.queue = [];
    this.working = false;
    this.gamelog = gamelog;
    this.errlog = errlog;
  }
  log(report) {
    this.queue.push(report);
    const { error, date } = report;
    if (error) Logger.errorToConsole(error, date);
    if (!this.working) this.getNext();
    return this;
  }
  static errorToConsole(error, date) {
    const hours = date.getHours();
    const mins = date.getMinutes();
    const mls = date.getMilliseconds();
    console.error(`\x1b[0;32m${hours}:${mins}:${mls}\x1b[0m`);
    console.error(`\x1b[0;31m${error.stack}\x1b[0m`);
    return this;
  }
  getNext() {
    if (this.working || !this.queue.length) return;
    this.working = true;
    const {
      id,
      username,
      command,
      input,
      error,
      date
    } = this.queue.shift();
    const message =
      draw(date.toString(), COLORS.blue) +
      `\nUser ${draw(id, COLORS.cyan)} ` +
      `(@${draw(username, COLORS.cyan)}) ` +
      `tried to call ${draw(command, COLORS.green)}\n` +
      'Call has ' +
      (
        error ?
          `❌ ${draw('FAILED', COLORS.red)} ❌` :
          `been finished ✅ ${draw('SUCCESSFULLY', COLORS.green)} ✅`
      ) +
      `\nUser's input: ${draw(input, COLORS.yellow)}\n\n`;
    appendFile(this.gamelog, message, err => {
      if (err) throw err;
      if (error) {
        appendFile(this.errlog, date + '\n' + error.stack + '\n\n', err => {
          if (err) throw err;
          this.working = false;
          this.getNext();
        });
        return;
      }
      this.working = false;
      this.getNext();
    });
  }
};
