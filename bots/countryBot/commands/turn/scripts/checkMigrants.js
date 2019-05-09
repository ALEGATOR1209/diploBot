'use strict';

const {
  getText,
  givePassport,
  findUser,
  getAllCountries,
  setMigrantQueue,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'givePassport',
    'findUser',
    'getAllCountries',
    'setMigrantQueue',
  ]);
const text = t => getText('checkMigrants')[t];

const checkMigrants = ctx => {
  const countrylist = getAllCountries();

  for (const state in countrylist) {
    const country = countrylist[state];
    const { immigrantQueue } = country;
    if (immigrantQueue.length > 0) {
      for (const migrant of immigrantQueue) {
        if (country.blacklist[migrant]) {
          ctx.bot
            .telegram
            .getChat(migrant)
            .then(({ username }) => {
              ctx.reply(
                text(1)
                  .replace('{user}', username)
                  .replace('{country}', country.name) +
                text(2),
                { chat_id: `@${country.chat}` }
              );

              ctx.reply(
                text(3)
                  .replace('{country}', country.name),
                { chat_id: migrant }
              );
            });

          const queue = country.immigrantQueue
            .filter(el => el !== migrant);
          setMigrantQueue(country.chat, queue);
          continue;
        }

        const motherland = findUser(migrant);
        if (motherland) {
          ctx.reply(
            text(4)
              .replace('{country1}', country.name)
              .replace('{country2}', motherland.name),
            { chat_id: migrant }
          );
          const queue = country.immigrantQueue
            .filter(el => el !== migrant);
          setMigrantQueue(country.chat, queue);
          continue;
        }

        givePassport(country, migrant);
        const queue = country.immigrantQueue
          .filter(el => el !== migrant);
        setMigrantQueue(country.chat, queue);
        ctx.reply(
          text(5)
            .replace('{country_name}', country.name)
            .replace('{country_chat}', country.chat),
          { chat_id: migrant }
        );
        ctx.bot
          .telegram
          .getChat(migrant)
          .then(({ username }) => ctx.reply(
            text(6)
              .replace('{username}', username)
              .replace('{class}', country.migrantClass),
            {
              parse_mode: 'HTML',
              chat_id: `@${country.chat}`,
            }
          ));
      }
    }
  }
};

module.exports = checkMigrants;
