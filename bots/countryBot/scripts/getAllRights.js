'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterRights = new FileSync(`${databases}/rights.json`);

const getAllRights = low(adapterRights)
    .get('rights')
    .value();

module.exports = getAllRights;
