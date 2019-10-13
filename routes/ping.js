const Discord = require("discord.js");
const helpers = require("../helpers");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content.startsWith(helpers.formatCommand("ping"))) {
      msg.channel.send(
        "Pong! `" + client.ping.toString().split(".")[0] + "ms`"
      );
    }
  });
};
