'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/states.json');

const setState = (id, name, value) => {
  const BDstates = low(adapterStates);
  BDstates.defaults({}).write();

  if (value === null) {
    BDstates
      .unset(id)
      .write();
    return;
  }

  BDstates
    .unset(id)
    .write();
  BDstates
    .set(`${id}.${name}`, value)
    .write();
  return true;
};

module.exports = setState;
