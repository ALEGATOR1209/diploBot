'use strict';

const reaction = async charon => {
  const {
    findUser,
    getText,
    revoltToString,
    setRevolution,
  } = charon.get([
    'findUser',
    'getText',
    'revoltToString',
    'setRevolution',
  ]);
  const text = t => getText('reaction')[t];

  const { id } = charon.update.callback_query.from;
  const { username: chat } = charon.update.callback_query.message.chat;
  const country = findUser(id);

  if (!country || country.chat !== chat) {
    charon.answerCbQuery(text(5));
    return;
  }

  const revolutions = Object.keys(country.revolution);
  const currentRebellionId = revolutions
    .find(rev => country.revolution[rev].active);
  const currentRebellion = country.revolution[currentRebellionId];
  if (!currentRebellion) {
    charon.answerCbQuery(text(1));
    return;
  }
  charon.answerCbQuery(text(2));
  if (currentRebellion.reactioners.includes(id)) return;
  if (currentRebellion.rebels.includes(id)) {
    currentRebellion.rebels = currentRebellion.rebels
      .filter(rebel => rebel !== id);
  }
  currentRebellion.reactioners.push(id);
  setRevolution(country.chat, currentRebellionId, currentRebellion, true);

  const { username: tag } = await charon.getChat(currentRebellionId);
  charon.editMessageText(
    revoltToString(country, id).replace('{leader}', `@${tag}`),
    {
      buttons: [
        { text: text(3), action: 'revolt' },
        { text: text(4), action: 'reaction' }
      ],
      type: 'inlineKeyboard',
    }
  );
};

module.exports = reaction;
