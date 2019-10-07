const sharp = require("sharp");
const rp = require("request-promise");

const helpers = require("../helpers");
const console = require("prefix-logger")("route.colors");

module.exports = function(client) {
  client.on("message", async msg => {
    if (msg.content.startsWith(helpers.formatCommand("colors"))) {
      const searchTag = msg.content.split("colors ")[1];

      const url = `https://xbl-api.prouser123.me/profile/gamertag/${encodeURIComponent(
        searchTag
      )}`;
      helpers.debug.level1(`url: ${url}`, "route.search");

      const user = await rp({
        url: `https://xbl-api.prouser123.me/profile/gamertag/${encodeURIComponent(
          searchTag
        )}`
      }).catch(err => {
        msg.reply("Sorry, I coudn't get your request from the API.");
        console.error(err);
        return;
      });

      const colasset = await rp({
        url: JSON.parse(user).profileUsers[0].settings[9].value
      }).catch(err => {
        msg.reply("Sorry, I coudn't get your request from the API.");
        console.error(err);
        return;
      });

      const svg = await rp({
        url: `https://xbl-api.prouser123.me/usercolors/define/${encodeURIComponent(
          JSON.parse(colasset).primaryColor
        )}/${encodeURIComponent(
          JSON.parse(colasset).secondaryColor
        )}/${encodeURIComponent(JSON.parse(colasset).tertiaryColor)}`
      }).catch(err => {
        msg.reply("Sorry, I coudn't get your request from the API.");
        console.error(err);
        return;
      });

      const png = await sharp(Buffer.from(svg))
        .png()
        .toBuffer();

      msg.channel.send({
        files: [
          {
            name: "colors.png",
            attachment: png
          }
        ]
      });
    }
  });
};
