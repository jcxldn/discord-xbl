const helpers = require("../helpers");
const request = require("request");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content == helpers.formatCommand("self")) {
      //msg.reply("Pong!");

      const url = `https://xbl.io/api/v2/account`;
      //const url = `https://xbl.io/api/v2/friends/search?gt=Prouser123`;
      const headers = { "X-Authorization": process.env.XBL_TOKEN };
      request({ url, headers }, function(error, response, body) {
        const json = JSON.parse(body);
        const data = helpers.responseFormatter.myAccount(body);
        helpers.debug.level2(JSON.stringify(data), "route.self.data")
        helpers.log(`Rate Limit Remaining: ${helpers.getRemainingRateLimit(response)}`, "route.self");
        // Create and send an embed
        //helpers.messages.sendNonRichUserEmbed(client, msg, json);
        //helpers.messages.sendRichUserEmbed(client, msg, json);
      });
    }
  });
};
