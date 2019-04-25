'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterLocalization = new FileSync('./databases/localization.json');
const getRandomChoice = require('./getRandomChoice');

const getText = id => {
  const text = low(adapterLocalization)
    .get(id)
    .value();
  for (const phrase in text)
    if (text[phrase] instanceof Array) {
      text[phrase] = getRandomChoice(text[phrase]);
    }
  return text;
}

module.exports = getText;
