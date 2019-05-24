const colors = require("colors/safe");
const { prefix } = require("../index");

const messages = require("./messages");
const responseFormatter = require("./response-formatter");
const debug = require("./debug");
const embed = require("./embed");

const formatCommand = command => {
  return `${prefix} ${command}`;
};

const getRemainingRateLimit = response => {
  return `${response.headers["x-ratelimit-remaining"]}/${
    response.headers["x-ratelimit-limit"]
  }`;
};

module.exports = {
  formatCommand,
  getRemainingRateLimit,
  messages,
  responseFormatter,
  debug,
  setEmbedStandards: embed.setEmbedStandards
};
