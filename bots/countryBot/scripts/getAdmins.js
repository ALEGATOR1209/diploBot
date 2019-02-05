'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const databases = '../../databases';

const adapterAdmins = new FileSync(`${databases}/admins.json`);

const getAdmins = () => {
  const DBadmins = low(adapterAdmins);
  return DBadmins.get('admins').value();
};

module.exports = getAdmins;
