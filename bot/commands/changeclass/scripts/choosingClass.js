'use strict';

const choosingClass = async charon => {
  const {
    setState,
    findUser,
    getText,
    getAllClasses,
    getChildClasses,
    getStates,
    editUser,
  } = charon.get([
    'setState',
    'findUser',
    'getText',
    'getAllClasses',
    'getChildClasses',
    'getStates',
    'editUser',
  ]);

  const text = t => getText('changeclass')[t];
  const { id } = charon.message.from;
  const userCountry = findUser(id);
  const slave = getStates(id).changeclass;
  const slaveCountry = findUser(slave);
  const newClass = charon.message.text
    .trim();

  if (!userCountry) {
    charon.reply(text(0) + text(2));
    setState(id, 'changeclass', null);
    return;
  }
  if (userCountry.citizens[id].inPrison) {
    charon.reply(text(0) + text(4));
    setState(id, 'changeclass', null);
    return;
  }
  const classlist = getAllClasses(userCountry.chat);
  const userClassName = userCountry.citizens[id].class;

  const childClasses = getChildClasses(userClassName, classlist);
  if (childClasses.length < 1) {
    charon.reply(text(0) + text(5));
    setState(id, 'changeclass', null);
    return;
  }

  const slavelist = Object.keys(userCountry.citizens)
    .filter(man =>
      childClasses.includes(userCountry.citizens[man].class) ||
      man === id + ''
    );
  if (slavelist.length < 1) {
    charon.reply(text(0) + text(6));
    setState(id, 'changeclass', null);
    return;
  }
  if (charon.message.text === text(11)) {
    setState(id, 'changeclass', null);
    charon.reply(text(0) + text(12));
    return;
  }

  if (!slaveCountry || slaveCountry.chat !== userCountry.chat) {
    setState(id, 'changeclass', null);
    charon.reply(text(0) + text(9));
    return;
  }
  if (!getAllClasses(userCountry.chat)[newClass]) {
    setState(id, 'changeclass', null);
    charon.reply(text(0) + text(2));
    return;
  }
  if (userCountry.hasRevolution) {
    setState(id, 'changeclass', null);
    charon.reply(text(0) + text(3));
    return;
  }
  const classCapacity = userCountry.classes[newClass].number;
  const classUsers = Object.keys(userCountry.citizens)
    .filter(man => userCountry.citizens[man].class === newClass);
  if (
    !classUsers.includes(slave) &&
    classCapacity > 0           &&
    classUsers.length >= classCapacity
  ) {
    charon.reply(text(0) + text(12));
    setState(id, 'changeclass', null);
    return;
  }

  if (userCountry.citizens[slave].class === newClass) {
    charon.reply(
      text(0) +
      text(17)
        .replace('{slaveClass}', newClass)
    );
    setState(id, 'changeclass', null);
    return;
  }

  editUser(userCountry.chat, slave, { class: newClass });
  setState(id, 'changeclass', null);

  const { username: tag } = await charon.getChat(slave);
  if (charon.message.chat.username !== userCountry.chat)
    charon.reply(text(0) + text(18));
  charon.reply(
    text(19)
      .replace('{username}', `@${tag}`)
      .replace('{class}', newClass),
    null,
    { chat_id: `@${slaveCountry.chat}` }
  );
};

module.exports = choosingClass;
