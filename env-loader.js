// Require local files / modules
const helpers = require("./helpers");

// Attempt to import the universal-dotenv package to load env vars from .env.
try {
  require("universal-dotenv");
  helpers.log("Using universal-dotenv.", "env");
} catch (e) {
  if (e.code !== "MODULE_NOT_FOUND") {
    helpers.warn("Coudn't find universal-dotenv.", "env");
  }
}

let isExiting = false;

// Check for variables
if (process.env.XBL_TOKEN === undefined) {
  helpers.warn("no token: Xbox Live", "env");
  isExiting = true;
} else {
  helpers.log("found token: Xbox Live", "env");
}

if (process.env.DISCORD_TOKEN === undefined) {
  helpers.warn("no token: Discord", "env");
  isExiting = true;
} else {
  helpers.log("found token: Discord", "env");
}

if (isExiting) {
  helpers.log("Exiting...", "env");
  process.exit();
}
