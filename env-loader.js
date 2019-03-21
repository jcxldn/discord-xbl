// Require local files / modules
const helpers = require("./helpers");
const console = require("prefix-logger")("env");

// Attempt to import the universal-dotenv package to load env vars from .env.
try {
  require("universal-dotenv");
  console.log("Using universal-dotenv.");
} catch (e) {
  if (e.code !== "MODULE_NOT_FOUND") {
    console.warn("Coudn't find universal-dotenv.");
  }
}

// Check for variables
if (process.env.XBL_TOKEN === undefined) {
  console.warn("no token: Xbox Live");
  isExiting = true;
} else {
  console.log("found token: Xbox Live");
}

if (process.env.DISCORD_TOKEN === undefined) {
  console.warn("no token: Discord");
  isExiting = true;
} else {
  console.log("found token: Discord");
}
