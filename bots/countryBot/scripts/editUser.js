'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapterStates = new FileSync('./databases/countries.json');

const editUser = (country, user, options) => {
  const DBcountries = low(adapterStates);
  const allCitizens = DBcountries.get(`countries.${country}.citizens`);
  const citizen = allCitizens.value()[user];
  Object.assign(citizen, options);
  allCitizens
    .set(user, citizen)
    .write();
};

module.exports = editUser;
