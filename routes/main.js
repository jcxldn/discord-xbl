const Discord = require("discord.js");
const helpers = require("../helpers");
const { prefix } = require("../index");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content == prefix) {
      // get git revision
      revision = require("child_process")
        .execSync("git rev-parse --short HEAD")
        .toString()
        .trim();
      // create embed
      embed = new Discord.RichEmbed()
        .setColor(3447003)
        .setAuthor("Commands", client.user.avatarURL)
        // Set footer text, icon and timestamp
        .setFooter(`Xbox Live | ${prefix} (${revision})`, client.user.avatarURL)
        .setTimestamp()
        // Add fields
        .addField("!xbox search <gamertag>", "find a user by their gamertag")
        .addField("!xbox xuid <xuid>", "find a user by their xbox user id")
        .addField("!xbox status", "show xbox live service status / information")
        .addField("!xbox ping", "ping the bot and get a response time");
      msg.channel.send({ embed });
    }
  });
};
