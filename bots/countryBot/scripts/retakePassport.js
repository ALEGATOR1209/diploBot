'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const retakePassport = ({ chat }, username) => {
  const DBcountries = low(adapterStates);
  const country = DBcountries.get('countries')
    .find(country => country.chat === chat);

  let people = country.get('citizens');
  const i = country.get('citizens')
    .value()
    .findIndex(man => man === username);

  people = [...people.value().slice(0, i), ...people.value().slice(i + 1)];
  country.set('citizens', people)
    .write();
};

module.exports = retakePassport;
