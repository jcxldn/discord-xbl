const helpers = require("../helpers");
const request = require("request");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content.startsWith(helpers.formatCommand("search"))) {
      msg.reply("Pong!");
      const searchTag = msg.content.split("search")[1];
      msg.reply(searchTag);

      //const url = `https://xbl.io/api/v2/account`;
      const url = `https://xbl.io/api/v2/friends/search?gt=${encodeURIComponent(searchTag)}`;
      const headers = { "X-Authorization": process.env.XBL_TOKEN };
      request({ url, headers }, function(error, response, body) {
        const json = JSON.parse(body);
        console.log(`Picture URL: ${json.profileUsers[0].settings[0].value}`);
        console.log(`Gamerscore: ${json.profileUsers[0].settings[1].value}`);
        console.log(`Gamertag: ${json.profileUsers[0].settings[2].value}`);
        console.log(
          `Subscription Type: ${json.profileUsers[0].settings[3].value}`
        );
        console.log(`Reputation: ${json.profileUsers[0].settings[4].value}`);
        console.log(`Real Name: ${json.profileUsers[0].settings[6].value}`);
        console.log(`Bio: ${json.profileUsers[0].settings[7].value}`);
        console.log(`Location: ${json.profileUsers[0].settings[8].value}`);
        console.log(
          `Rate Limit Remaining: ${helpers.getRemainingRateLimit(response)}`
        );
        // Create and send an embed
        helpers.messages.sendRichUserEmbed(client, msg, json);
      });
    }
  });
};
