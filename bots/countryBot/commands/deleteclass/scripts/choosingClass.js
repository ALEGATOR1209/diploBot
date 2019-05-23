'use strict';

const deleteClass = charon => {
  const {
    getText,
    findUser,
    setState,
    getChildClasses,
    getAllClasses,
    removeClass,
  } = charon.get([
    'getText',
    'findUser',
    'setState',
    'getChildClasses',
    'getAllClasses',
    'removeClass',
  ]);
  const text = t => getText('deleteclass')[t];
  const { id } = charon.message.from;
  const country = findUser(id);

  if (charon.message.text.match(
    new RegExp(`^${text(6)}$`, 'gi')
  )) {
    charon.reply(text(0) + text(8));
    setState(id, 'deletingClass', null);
    return;
  }

  if (!country) {
    charon.reply(text(0) + text(2));
    setState(id, 'deletingClass', null);
    return;
  }
  if (country.hasRevolution) {
    charon.reply(text(0) + text(7));
    setState(id, 'deletingClass', null);
    return;
  }

  if (country.citizens[id].inPrison) {
    charon.reply(text(0) + text(9));
    setState(id, 'deletingClass', null);
    return;
  }

  const userClass = country.citizens[id].class;
  const classlist = getAllClasses(country.chat);
  const childClasses = getChildClasses(userClass, classlist);

  const emptyClasses = childClasses.filter(classname => {
    for (const man in country.citizens) {
      if (country.citizens[man].class === classname) return false;
    }
    return true;
  });
  if (emptyClasses.length < 1) {
    charon.reply(text(0) + text(4));
    setState(id, 'deletingClass', null);
    return;
  }

  const classToDelete = charon.message.text;
  if (!emptyClasses.includes(classToDelete)) {
    charon.reply(text(0) + text(5));
    setState(id, 'deletingClass', null);
    return;
  }

  removeClass(country.chat, classToDelete);
  setState(id, 'deletingClass', null);
  if (charon.message.chat.username !== country.chat) {
    charon.reply(text(11));
  }
  charon.reply(
    text(12).replace('{class}', classToDelete),
    null,
    { chat_id: `@${country.chat}` }
  );
};

module.exports = deleteClass;
