'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const DEFAULT_LAZY = 36000000; //1 hour

/*
task examples:

set-task:
{
  field: value
}

get-task:
[
  field1, field2, field3, ...
]
 */


class DbWorker {
  constructor(database) {
    this.database = database;
    this.working = false;
    this.tasks = [];
    this.lastWork = new Date();
  }
  write(field, data) {
    this.database
      .set(field, data)
      .write();
    return this;
  }
  get(field) {
    return this.database
      .get(field)
      .value();
  }
  task(task) {
    if (task instanceof Array) { //get fields
      const result = task.map(field => this.get(field));
      return result;
    }

    const fields = Object.keys(task);
    for (const field of fields) { //set fields
      this.write(field, task[field]);
    }
  }
}

class DbManager {
  constructor(path) {
    this.path = path;
    this.pool = {};

    const handler = {
      get: (manager, db) => manager.getWorker(db),
    };

    const proxy = new Proxy(this, handler);
    return proxy;
  }
  getWorker(db) {
    if (!this.pool[db]) {
      console.log('Creating worker');
      this.pool[db] = new DbWorker(low(new FileSync(this.path + db + '.json')));
    } else { console.log('From pool'); }
    return this.pool[db];
  }
}

module.exports = DbManager;

//USAGE
const manager = new DbManager('../databases/');
let [ admins ] = manager.admins.task([ 'admins' ]);
console.dir({ admins });

manager.admins.task({ admins: [ ...admins, 'hello!' ] });
[ admins ] = manager.admins.task([ 'admins' ]);
console.dir({ admins });

const [ players ] = manager.players.task([ 'players' ]);
console.dir({  players });
