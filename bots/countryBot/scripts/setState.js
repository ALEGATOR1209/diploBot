'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/states.json`);

const setState = (id, name, value) => {
  const BDstates = low(adapterStates);
  BDstates.defaults({}).write();

  if (value === null) {
    BDstates
      .unset(`${id}.${name}`)
      .write();
    return;
  }

  BDstates
    .set(`${id}.${name}`, value)
    .write();
  return true;
}

setState(0, "someState", null);

module.exports = setState;
