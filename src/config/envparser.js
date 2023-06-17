/* eslint-disable no-undef */
const DotEnv = require('dotenv');
const parsedEnv = DotEnv.config().parsed;

module.exports = function () {
  // Let's stringify our variables
  for (key in parsedEnv) {
    if (typeof parsedEnv[key] === 'string') {
      console.log(parsedEnv[key]);
      parsedEnv[key] = JSON.stringify(parsedEnv[key]);
    }
  }
  return parsedEnv;
};
