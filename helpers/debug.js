const colors = require("colors/safe");
const { debugLevel } = require("../index");

function level1(message, prefix = "xb1") {
  debugLevel >= 1 ? console.log(`${colors.magenta(prefix)} ${message}`) : null;
}

function level2(message, prefix = "xb1") {
  debugLevel >= 2 ? console.log(`${colors.blue(prefix)} ${message}`) : null;
}

module.exports = { level1, level2 };
