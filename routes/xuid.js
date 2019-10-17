const helpers = require("../helpers");
const console = require("prefix-logger")("route.xuid");
const rp = require("request-promise");

module.exports = function(client) {
  client.on("message", async msg => {
    if (msg.content.startsWith(helpers.formatCommand("xuid"))) {
      const searchTag = msg.content.split("xuid ")[1];
      try {
        const profile = await rp(
          `https://xbl-api.prouser123.me/profile/xuid/${encodeURIComponent(
            searchTag
          )}`
        );

        // Check the profile body for error codes from API.
        if (!helpers.responseFormatter.checkBody(profile)) {
          msg.reply("We coudn't find that user. Please try again.");
          return;
        }

        const fsummary = await rp(
          `https://xbl-api.prouser123.me/friends/summary/xuid/${encodeURIComponent(
            searchTag
          )}`
        );

        // Format data
        const data = helpers.responseFormatter.px_profile_fsummary(
          profile,
          fsummary
        );
        // Create and send an embed
        helpers.messages.sendRichUserEmbed(client, msg, data);
      } catch (err) {
        return helpers.errorReplyLog(msg, console, err);
      }
    }
  });
};
