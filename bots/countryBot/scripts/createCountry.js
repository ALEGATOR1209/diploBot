'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapterStates = new FileSync('./databases/countries.json');
const adapterRigths = new FileSync('./databases}/rights.json');

const createCountry = (name, chat) => {
  const DBcountries = low(adapterStates);
  const DBrights = low(adapterRigths);
  const countries = DBcountries.get('countries');
  countries.set(chat,
    {
      name,
      chat,
      citizens: {},
      classes: {
        default: {
          rights: DBrights.get('rights').value()
        },
      },
      blacklist: {},
      migrantClass: 'default',
    }
  ).write();
  return countries.value();
};

module.exports = createCountry;
