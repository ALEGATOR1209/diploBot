'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const addToMigrantQueue = (chat, user) => {
  const db = low(adapterStates);
  const queue = db
    .get(`countries.${chat}.immigrantQueue`)
    .value();
  db.set(`countries.${chat}.immigrantQueue`, [...queue, user])
    .write();
};

module.exports = addToMigrantQueue;
