'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterCountries = new FileSync('./databases/countries.json');

const setLaw = (country, name, law) => {
  const countries = low(adapterCountries);

  if (law === null) {
    countries
      .unset(`countries.${country}.laws.${name}`)
      .write();
    return;
  }

  countries
    .set(`countries.${country}.laws.${name}`, law)
    .write();
  return true;
};

module.exports = setLaw;
