'use strict';

const {
  getText,
  getCountry,
  givePassport,
  retakePassport,
  findUser,
  getAllCountries,
  setMigrantQueue,
  setEmigrantQueue,
} = require('../../../../imports').few('countryBot', 'scripts',
  [
    'getText',
    'getCountry',
    'givePassport',
    'retakePassport',
    'findUser',
    'getAllCountries',
    'setMigrantQueue',
    'setEmigrantQueue',
  ]);
const text = t => getText('checkMigrants')[t];

const checkMigrants = ctx => {
  const resolveImmigrats = country => {
    const { immigrantQueue } = country;
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

        const queue = getCountry(country.chat).immigrantQueue
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
        const queue = getCountry(country.chat).immigrantQueue
          .filter(el => el !== migrant);
        setMigrantQueue(country.chat, queue);
        continue;
      }

      givePassport(country, migrant);
      const queue = getCountry(country.chat).immigrantQueue
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
  };

  const resolveEmigrants = country => {
    const { emigrantQueue } = country;
    for (const emigrant of emigrantQueue) {
      if (!country.citizens[emigrant]) {
        ctx.reply(
          text(7)
            .replace('{country}', country.name),
          { chat_id: emigrant }
        );
        const queue = getCountry(country.chat).emigrantQueue
          .filter(man => man !== emigrant);
        setEmigrantQueue(country.chat, queue);
        continue;
      }

      if (country.citizens[emigrant].inPrison) {
        ctx.reply(
          text(8)
            .replace('{country}', country.name),
          { chat_id: emigrant }
        );
        const queue = getCountry(country.chat).emigrantQueue
          .filter(man => man !== emigrant);
        setEmigrantQueue(country.chat, queue);
        continue;
      }

      retakePassport(country, emigrant);
      ctx.reply(
        text(9).replace('{country}', country.name),
        { chat_id: emigrant }
      );
      ctx.bot
        .telegram
        .getChat(emigrant)
        .then(({ username }) => ctx.reply(
          text(10)
            .replace('{username}', username)
            .replace('{country}', country.name),
          {
            parse_mode: 'HTML',
            chat_id: `@${country.chat}`,
          }
        ));

      const queue = getCountry(country.chat).emigrantQueue
        .filter(man => man !== emigrant);
      setEmigrantQueue(country.chat, queue);
    }
  };

  const countrylist = getAllCountries();

  for (const state in countrylist) {
    const country = countrylist[state];
    if (country.emigrantQueue.length > 0) resolveEmigrants(country);
    if (country.immigrantQueue.length > 0) resolveImmigrats(country);
  }
};

module.exports = checkMigrants;
