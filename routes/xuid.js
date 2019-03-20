const helpers = require("../helpers");
const request = require("request");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content.startsWith(helpers.formatCommand("xuid"))) {
      const searchTag = msg.content.split("xuid ")[1];

      if (searchTag.length !== 16 || isNaN(searchTag)) {
          msg.reply("Invalid XUID. Please try again.")
          return;
      }

      const url = `https://xbl.io/api/v2/player/summary/${encodeURIComponent(searchTag)}`;
      helpers.debug.level1(`url: ${url}`, "route.xuid");

      const headers = { "X-Authorization": process.env.XBL_TOKEN };
      request({ url, headers }, function(error, response, body) {
        // Check the HTTP Response Code.
        if (response.statusCode !== 200) {
          msg.reply("Sorry, I coudn't get your request from the API.");
          helpers.warn(`HTTP Response ${response.statusCode}`, "route.search");
          return;
        }

        // Check the body for error codes from API.
        if (!helpers.responseFormatter.checkBody(body)) {
          msg.reply("We coudn't find that XUID. Please try again.");
          return;
        }

        // Format data
        const data = helpers.responseFormatter.playerSummary(body);
        // Create and send an embed
        helpers.messages.sendRichUserEmbed(client, msg, data);
      });
    }
  });
};
