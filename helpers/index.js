const colors = require("colors/safe");
const { prefix } = require("../index");

const messages = require("./messages");
const responseFormatter = require("./response-formatter");
const debug = require("./debug");

const formatCommand = command => {
  return `${prefix} ${command}`;
};

const getRemainingRateLimit = response => {
  return `${response.headers["x-ratelimit-remaining"]}/${
    response.headers["x-ratelimit-limit"]
  }`;
};

function log(message, prefix = "xbl") {
  console.log(`${colors.grey(prefix)} ${message}`);
}

function warn(message, prefix = "xbl") {
  console.warn(`${colors.grey(prefix)} ${colors.red(message)}`);
}

module.exports = {
  formatCommand,
  getRemainingRateLimit,
  log,
  warn,
  messages,
  responseFormatter,
  debug
};
