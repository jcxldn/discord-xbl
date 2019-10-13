const Discord = require("discord.js");
const helpers = require("../helpers");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content.startsWith(helpers.formatCommand("invite"))) {
      msg.author.send(
        "Click the link to add me to your server!\nhttps://jcx.page.link/discord-xbl-invite"
      );
    }
  });
};
