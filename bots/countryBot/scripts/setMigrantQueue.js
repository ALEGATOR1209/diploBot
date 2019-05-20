'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const setMigrantQueue = (chat, queue) => {
  const db = low(adapterStates);
  db.set(`countries.${chat}.immigrantQueue`, queue)
    .write();
};

module.exports = setMigrantQueue;
