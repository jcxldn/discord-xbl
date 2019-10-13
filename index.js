// require packages
const Discord = require("discord.js");
const colors = require("colors/safe");
const console = require("prefix-logger")("index");

// Prefix
const prefix = "!xbox";

// Debug
const debugLevel = 2;

module.exports = { prefix, debugLevel };

// -------------------- Exit Handler --------------------

// To prevent the exit handler from being called multiple times at once
let isExiting = false;

function exitHandler(options, exitCode) {
  if (!isExiting) {
    isExiting = true;
    console.warn("Cleaning up...", "exit");
    try {
      client.destroy();
      console.warn("Disconnected from Discord.", "exit");
    } catch (e) {
      console.log("Discord never connected.", "exit");
    }
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
process.on("uncaughtException", function(e) {
  console.error(e, "uncaughtException");
  exitHandler();
});

// -------------------- Environment Variables --------------------

// Attempt to import the universal-dotenv package to load env vars from .env.
try {
  require("universal-dotenv");
  console.log("Using universal-dotenv.");
} catch (e) {
  if (e.code !== "MODULE_NOT_FOUND") {
    console.warn("Coudn't find universal-dotenv.");
  }
}

if (process.env.DISCORD_TOKEN === undefined) {
  console.error("no token: Discord");
  exitHandler.call(null);
} else {
  console.log("found token: Discord");
}

// Print some constants
console.log(`Bot prefix: ${colors.green(prefix)}`);

// -------------------- Discord Client Stuff --------------------

// Create a new instance of the client
const client = new Discord.Client();

// Register on ready
client.on("ready", () => {
  console.log(`Logged in as ${colors.green(client.user.tag)}!`);
  client.user.setPresence({
    status: "online",
    game: { name: `${prefix} | Alpha` }
  });
  console.log(`Connected to ${colors.green(client.guilds.size)} guilds.`);

  // Print bot invite
  client.generateInvite(["SEND_MESSAGES", "READ_MESSAGES"]).then(link => {
    console.log(`Bot invite link: ${link}`);
  });
});

// Log to console when the bot joins a server
client.on("guildCreate", function(guild) {
  console.log(guild.name, "guild.join");
});

// Log to console when the bot leaves a server
client.on("guildDelete", function(guild) {
  console.log(guild.name, "guild.leave");
});

// Register everything in the routes folder
require("./routes")(client);

client.login(process.env.DISCORD_TOKEN);
