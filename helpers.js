const colors = require("colors/safe");
const { prefix } = require("./index");

const formatCommand = command => {
  return `${prefix} ${command}`;
};

function log(message, prefix = "xbl") {
  console.log(`${colors.grey(prefix)} ${message}`);
}

function warn(message, prefix = "xbl") {
  console.warn(`${colors.grey(prefix)} ${colors.red(message)}`);
}

module.exports = {
  formatCommand,
  log,
  warn
};
