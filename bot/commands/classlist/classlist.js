'use strict';

const classlist = charon => {
  const {
    getAllClasses,
    findUser,
    getText,
  } = charon.get([
    'getAllClasses',
    'findUser',
    'getText',
  ]);
  const text = t => getText('classlist')[t];
  const { id } = charon.message.from;
  const userCountry = findUser(id);

  if (!userCountry) {
    charon.reply(text(1));
    return;
  }

  const classList = Object.keys(getAllClasses(userCountry.chat));
  charon.reply(
    `${text(2)} ${userCountry.name}:\n\n` + text(3) +
    classList.join('\n' + text(3))
  );
};

module.exports = classlist;
