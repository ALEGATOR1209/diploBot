'use strict';

const blacklist = async charon => {
  const {
    findUser,
    getText,
    getCountry,
  } = charon.get([
    'findUser',
    'getText',
    'getCountry',
  ]);
  const text = t => getText('blacklist')[t];
  const { id } = charon.message.from;
  let country;
  if (charon.message.chat.type === 'private') {
    country = findUser(id);
    if (!country) {
      charon.reply(text(1));
      return;
    }
    if (country.hasRevolution) {
      charon.reply(text(7));
      return;
    }
  } else if (getCountry(charon.message.chat.username)) {
    country = getCountry(charon.message.chat.username);
  } else {
    charon.reply(text(1));
    return;
  }

  const blacklist = country.blacklist;
  if (blacklist.length < 1) {
    charon.reply(text(6));
    return;
  }
  let answer = text(2) + `<b>${country.name}</b>\n`;

  for (const person in blacklist) {
    const { username, first_name } = await charon.getChat(person);
    if (!username) {
      answer +=
        `${text(5)}<a href="t.me/${person}">${first_name}</a>` +
        `- ${text(3) + country.blacklist[person].banTurn + text(4)}.`;
    }
    answer +=
      `${text(5)}@${username} ` +
      `- ${text(3) + country.blacklist[person].banTurn + text(4)}.`;
  }
  charon.reply(answer);
};

module.exports = blacklist;
