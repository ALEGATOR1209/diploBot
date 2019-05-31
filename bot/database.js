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
    this.lastWork = new Date();
    if (task instanceof Array) { //get fields
      const result = task.map(field => this.get(field));
      return result;
    }

    const fields = Object.keys(task);
    for (const field of fields) { //set fields
      this.write(field, task[field]);
    }
  }
  getLastWork() {
    if (this.working) return new Date();
    return this.lastWork;
  }
}

class DbManager {
  constructor(path) {
    this.path = path;
    this.pool = {};

    const handler = {
      get: (manager, db) => manager.getWorker(db),
    };

    return new Proxy(this, handler);
  }
  getWorker(db) {
    if (!this.pool[db]) {
      this.pool[db] = new DbWorker(low(new FileSync(this.path + db + '.json')));
      this.oppress(db);
    }
    return this.pool[db];
  }
  //this method kills worker that has been out of work for 1 hour
  //cruel world of capitalism as is
  oppress(worker) {
    const lastWork = this.pool[worker]
      .getLastWork();
    const lazinessTime = new Date() - lastWork;

    if (lazinessTime >= DEFAULT_LAZY) delete this.pool[worker];
    else setTimeout(() => this.oppress(worker), DEFAULT_LAZY - lazinessTime);
  }
}

module.exports = DbManager;
