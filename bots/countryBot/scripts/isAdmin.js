'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const databases = '../../databases';

const adapterAdmins = new FileSync(`${databases}/admins.json`);
const DBadmins = low(adapterAdmins);
const admins = DBadmins.get('admins');

const isAdmin = user => (!!admins.value().includes(user));

module.exports = isAdmin;
