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

const errorReplyLog = (msg, c, err) => {
  msg.reply("Sorry, I coudn't get your request from the API.");
  c.error(
    `Error by user '${msg.author.tag}' in message '${msg.content}', ERR:`.bold +
      " " +
      colors.italic(err.message)
  );
  return;
};

module.exports = {
  formatCommand,
  getRemainingRateLimit,
  errorReplyLog,
  messages,
  responseFormatter,
  debug,
  setEmbedStandards: embed.setEmbedStandards
};
