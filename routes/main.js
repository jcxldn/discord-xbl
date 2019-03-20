const Discord = require("discord.js");
const helpers = require("../helpers");
const { prefix } = require("../index");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content == prefix) {
      embed = new Discord.RichEmbed()
        .setColor(3447003)
        .setAuthor("Commands", client.user.avatarURL)
        // Set footer text, icon and timestamp
        .setFooter(`Xbox Live | ${prefix}`, client.user.avatarURL)
        .setTimestamp()
        // Add fields
        .addField("!xbox search <gamertag>", "find a user by their gamertag")
        .addField("!xbox xuid <xuid>", "find a user by their xbox user id");
      msg.channel.send({ embed });
    }
  });
};
