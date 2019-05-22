'use strict';

const checkMigrants = charon => {
  const {
    getText,
    getCountry,
    givePassport,
    retakePassport,
    findUser,
    getAllCountries,
    setMigrantQueue,
    setEmigrantQueue,
  } = charon.get([
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

  const resolveImmigrats = async country => {
    const { immigrantQueue } = country;
    for (const migrant of immigrantQueue) {
      if (country.blacklist[migrant]) {
        const { username } = charon.getChat(migrant);
        charon.reply(
          text(1)
            .replace('{user}', username)
            .replace('{country}', country.name) +
          text(2),
          null,
          { chat_id: `@${country.chat}` }
        );

        charon.reply(
          text(3)
            .replace('{country}', country.name),
          { chat_id: migrant }
        );

        const queue = getCountry(country.chat).immigrantQueue
          .filter(el => el !== migrant);
        setMigrantQueue(country.chat, queue);
        continue;
      }

      const motherland = findUser(migrant);
      if (motherland) {
        charon.reply(
          text(4)
            .replace('{country1}', country.name)
            .replace('{country2}', motherland.name),
          null,
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
      charon.reply(
        text(5)
          .replace('{country_name}', country.name)
          .replace('{country_chat}', country.chat),
        null,
        { chat_id: migrant }
      );
      const { username } = await charon.getChat(migrant);
      charon.reply(
        text(6)
          .replace('{username}', username)
          .replace('{class}', country.migrantClass),
        null,
        { chat_id: `@${country.chat}`, }
      );
    }
  };

  const resolveEmigrants = async country => {
    const { emigrantQueue } = country;
    for (const emigrant of emigrantQueue) {
      if (!country.citizens[emigrant]) {
        charon.reply(
          text(7)
            .replace('{country}', country.name),
          null,
          { chat_id: emigrant }
        );
        const queue = getCountry(country.chat).emigrantQueue
          .filter(man => man !== emigrant);
        setEmigrantQueue(country.chat, queue);
        continue;
      }

      if (country.citizens[emigrant].inPrison) {
        charon.reply(
          text(8)
            .replace('{country}', country.name),
          null,
          { chat_id: emigrant }
        );
        const queue = getCountry(country.chat).emigrantQueue
          .filter(man => man !== emigrant);
        setEmigrantQueue(country.chat, queue);
        continue;
      }

      retakePassport(country, emigrant);
      charon.reply(
        text(9).replace('{country}', country.name),
        null,
        { chat_id: emigrant }
      );
      const { username } = await charon.getChat(emigrant);
      charon.reply(
        text(10)
          .replace('{username}', username)
          .replace('{country}', country.name),
        null,
        { chat_id: `@${country.chat}` }
      );

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
