const Discord = require("discord.js");
const helpers = require("../helpers");
const { prefix } = require("../index");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content == prefix) {
      // create embed
      embed = new Discord.RichEmbed()
        .setAuthor("Commands", client.user.avatarURL)
        // Add fields
        .addField("!xbox search <gamertag>", "find a user by their gamertag")
        .addField("!xbox xuid <xuid>", "find a user by their xbox user id")
        .addField("!xbox forza <game> <gamertag>", "get a user's forza stats")
        .addField("!xbox status", "show xbox live service status / information")
        .addField("!xbox ping", "ping the bot and get a response time");

      // Set embed standards
      helpers.setEmbedStandards(embed, client);
      msg.channel.send({ embed });
    }
  });
};
