const sharp = require("sharp");
const rp = require("request-promise");

// Disable the sharp cache, fix for musl on Alpine Linux
// https://github.com/lovell/sharp/issues/838
sharp.cache(false);

const helpers = require("../helpers");
const console = require("prefix-logger")("route.colors");

module.exports = function(client) {
  client.on("message", async msg => {
    if (msg.content.startsWith(helpers.formatCommand("colors"))) {
      const searchTag = msg.content.split("colors ")[1];
      try {
        const svg = await rp({
          url: `https://xbl-api.prouser123.me/usercolors/get/gamertag/${encodeURIComponent(
            searchTag
          )}`
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
      } catch (err) {
        return helpers.errorReplyLog(msg, console, err);
      }
    }
  });
};
