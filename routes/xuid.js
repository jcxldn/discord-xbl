const helpers = require("../helpers");
const console = require("prefix-logger")("route.xuid");
const request = require("request");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content.startsWith(helpers.formatCommand("xuid"))) {
      const searchTag = msg.content.split("xuid ")[1];

      if (searchTag.length !== 16 || isNaN(searchTag)) {
        msg.reply("Invalid XUID. Please try again.");
        return;
      }

      const url = `https://xbl-api.prouser123.me/profile/xuid/${encodeURIComponent(
        searchTag
      )}`;
      helpers.debug.level1(`url: ${url}`, "route.xuid");

      request({ url }, function(error, response, body) {
        // Check the HTTP Response Code.
        if (response.statusCode !== 200) {
          msg.reply("Sorry, I coudn't get your request from the API.");
          console.warn(`HTTP Response ${response.statusCode}`);
          return;
        }

        // Check the body for error codes from API.
        if (!helpers.responseFormatter.checkBody(body)) {
          msg.reply("We coudn't find that XUID. Please try again.");
          return;
        }

        // Format data
        const data = helpers.responseFormatter.px_profile(body);
        // Create and send an embed
        helpers.messages.sendRichUserEmbed(client, msg, data);
      });
    }
  });
};
