// while not necessary, I prefer awaitables over callbacks
// this class provides an async wrapper around sql query functions

// BASIC USAGE:
/**
 * const sql = new AsyncSQL({
 *   host: "localhost",
 *   port: "3306",
 *   database: "complaint_management",
 *   user: process.env.DB_USER,
 *   password: process.env.DB_PASSWORD,
 * });
 *
 * // use your sql instance
 *
 * await sql.end();
 */

const sql = require("mysql2");
const { ENV } = require("./env");

const onlyErrCb = (resolve, reject) => (err) => {
  if (err) reject(err);
  else resolve(true);
};

const fieldResErrCb = (resolve, reject) => (err, res, fields) => {
  if (err) reject(err);
  else resolve([res, fields]);
};

const connectionCallbacks = {
  beginTransaction: onlyErrCb,
  changeUser: onlyErrCb,
  commit: onlyErrCb,
  end: onlyErrCb,
  execute: fieldResErrCb,
  query: fieldResErrCb,
  rollback: onlyErrCb,
};

const wrapAsync = (boundFunction, name) => {
  return (...args) =>
    new Promise((resolve, reject) => {
      boundFunction(
        ...args,
        connectionCallbacks[name](resolve.bind(this), reject.bind(this))
      );
    });
};

const defaultConnectionConfig = () => ({
  host: "localhost",
  port: "3306", // optional, default is 3306
  database: "complaint_management",
  user: "root",
  password: "123",
});

class AsyncSQL {
  connection;

  constructor(config = defaultConnectionConfig) {
    const _config = typeof config == "function" ? config() : config;
    console.log(_config);
    this.connection = sql.createConnection(_config);

    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) reject(err);
        else
          resolve(
            // this proxy returns the appropriate connection methods wrapped in a async wrapper
            new Proxy(this.connection, {
              get(target, p) {
                if (
                  typeof target[p] === "function" &&
                  p in connectionCallbacks
                ) {
                  return wrapAsync(target[p].bind(target), p);
                } else if (typeof target[p] === "function") {
                  return target[p].bind(target);
                } else return target[p];
              },
            })
          );
      });
    });
  }
}

module.exports = AsyncSQL;
