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

        const embed = new Discord.RichEmbed().setAuthor(
          "Xbox Live Service Status",
          client.user.avatarURL
        );

        helpers.setEmbedStandards(embed, client);

        // Add other services (the APIs we use for data)
        request("https://xbl-api.prouser123.me/dev/isauth", function(
          error,
          response,
          body
        ) {
          const statusId = JSON.parse(body).authenticated ? 1 : 2;
          json.push({
            name: "XBL-API",
            statusId,
            description: "The open source API that makes this bot possible."
          });

          // for each service, display it's name and description, as well as an emoji for it's status
          json.forEach(value => {
            const emoji = value.statusId == 1 ? ":white_check_mark: " : ":x: ";
            embed.addField(`${emoji} ${value.name}`, value.description);
          });
          msg.channel.send(embed);
        });
      });
    }
  });
};
