const Discord = require("discord.js");
const request = require("request");
const helpers = require("../helpers");
const { prefix } = require("../index");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content.startsWith(helpers.formatCommand("status"))) {
      const url = "https://api.prouser123.me/xbox/status";
      request(url, function(error, response, body) {
        const json = JSON.parse(body);

        const embed = new Discord.RichEmbed()
          .setColor(3447003)
          .setAuthor("Xbox Live Status", client.user.avatarURL)
          // Set footer text, icon and timestamp
          .setFooter(`Xbox Live | ${prefix}`, client.user.avatarURL)
          .setTimestamp();

        // for each service, display it's name and description, as well as an emoji for it's status
        json.forEach(value => {
          const emoji = (value.status = "Normal")
            ? ":white_check_mark:"
            : ":x:";
          embed.addField(`${emoji} ${value.name}`, value.description);
        });
        msg.channel.send(embed);
      });
    }
  });
};
