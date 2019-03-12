// require packages
const Discord = require("discord.js");
const colors = require("colors/safe");

// Prefix
const prefix = "!xbox";

// Debug
const debugLevel = 2;


module.exports = { prefix, debugLevel };

// Require local files / modules
require("./env-loader");
const helpers = require("./helpers");

// Print some constants
helpers.log(`Bot prefix: ${colors.green(prefix)}`, "index");

// -------------------- Discord Client Stuff --------------------

// Create a new instance of the client
const client = new Discord.Client();

// Register on ready
client.on("ready", () => {
  helpers.log(`Logged in as ${colors.green(client.user.tag)}!`, "index");
  client.user.setPresence({
    status: "online",
    game: { name: `${prefix} | Alpha` }
  });
});

// Register everything in the routes folder
require("./routes")(client);

client.login(process.env.DISCORD_TOKEN);

// -------------------- Exit Handler --------------------
/*
let isExiting = false;

function exitHandler(options, exitCode) {
  if (!isExiting) {
    isExiting = true;
    helpers.log("--------------------", "exit");
    helpers.log(colors.yellow("Cleaning up"), "exit");
    client.destroy();
    helpers.log(colors.yellow("Disconnected from Discord."), "exit");
    process.exit();
  }
}

//do something when app is closing
process.on("exit", exitHandler.bind(null));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null));
process.on("SIGUSR2", exitHandler.bind(null));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null));

*/
