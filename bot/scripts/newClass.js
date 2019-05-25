'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapterStates = new FileSync('./databases/countries.json');

const newClass = (country, name, options) => {
  const DBcountries = low(adapterStates);
  const classes = DBcountries.get(`countries.${country}.classes`);

  const userClass = classes.get(name).value();
  if (userClass) {
    Object.assign(userClass, options);
    classes
      .set(name, userClass)
      .write();
    return;
  }

  classes.set(name, options)
    .write();
};

module.exports = newClass;
