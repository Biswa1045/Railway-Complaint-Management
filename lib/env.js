const config = require("../config");

process.env = { ...process.env, ...config.env };

const ENV = () => Object.freeze({ ...process.env }); // unmutable reference to environment
const MUT_ENV = () => process.env; // mutable reference to environment

module.exports = {
  ENV,
  MUT_ENV,
};
