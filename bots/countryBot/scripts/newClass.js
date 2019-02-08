'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const databases = '../../databases';
const adapterStates = new FileSync(`${databases}/countries.json`);

const newClass = (country, name, options) => {
  const DBcoutnries = low(adapterStates);
  const classes = DBcoutnries.get(`countries.${country}.classes`);

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
