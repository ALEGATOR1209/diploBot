# Diplo bot

Telegram bot for managing countries in Military-Political Game ["Zeppelin: Belle Epoque"](https://t.me/ceppelinBE).

It watches under the playes actions like ruling armies, passing laws, making rebellions, assassinations, etc.

Gameplay is builded on the Rights and Classes system when each player belongs to some Class which is a set of Rights
allowing him to commit some game actions (like pass a law or rule armies).
On the other hand there are some illegal (or partly legal depends of laws of each country) actions
like assassination another player, rising up rebellion, etc. Every player represents a politic figure of some
period.

## Where does it works?

Bot instance is running on Digital Ocean's machine right now. [Try it by yourself](https://t.me/dipl_countryBot). 

## Why does it works?

Idk, it's all about Lord's mercy.

## How does it works?

Short data flow diagram:
![](https://habrastorage.org/webt/w1/xr/jt/w1xrjt8ffcmwk3as9zwwon8lm4y.png)
As Telegram Bot API implementation library was chosen [Telegraf.js](https://github.com/telegraf/telegraf).
As database was chosen primitive [lowdb](https://github.com/typicode/lowdb) - small JSON database.

When bot receives message, Telegram servers send webhook to host computer where it is captured by Telegraf.js.
Then Telegraf.js executes handler which is wrapped by Charon. Charon seeks for needed file and executes it asynchronously.
If error appears in command module, Charon catches it and says user that something wrong has happened.

[Charon](https://github.com/ALEGATOR1209/diploBot/blob/master/bot/Charon.js) is a big facade that, on the one hand,
covers Telegraf.js API and wraps the commands and state manages. It filters information sent by Telegram,
chooses important data, makes some magic things and, finally, routes messages through the project architecture.
On the other hand, it works like a router which finds right way from any bot's module to any another one using [this simple import manager](https://github.com/ALEGATOR1209/diploBot/blob/master/bot/imports.js).

All users actions is watching by **Big Brother**. System logs all actions in *game.log* and error in *err.log*.
Logging provided by [this logger](https://github.com/ALEGATOR1209/diploBot/blob/master/bot/logger.js) that is some kind of
async queue.

## Links

__[Game rules](https://teletype.in/@diplomacy/r1QTDi-oN)__  
__[Bot Documentation](https://teletype.in/@diplomacy/H1Xj09biV)__
