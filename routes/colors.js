const sharp = require("sharp");

const helpers = require("../helpers");
const console = require("prefix-logger")("route.colors");
const request = require("request");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content.startsWith(helpers.formatCommand("colors"))) {
      const searchTag = msg.content.split("colors ")[1];

      const url = `https://xbl-api.prouser123.me/profile/gamertag/${encodeURIComponent(
        searchTag
      )}`;
      helpers.debug.level1(`url: ${url}`, "route.search");
      request({ url }, function(error, response, body) {
        // Check the HTTP Response Code.
        if (response.statusCode !== 200) {
          msg.reply("Sorry, I coudn't get your request from the API.");
          console.warn(`HTTP Response ${response.statusCode}`);
          return;
        }

        // Check the body for error codes from API.
        if (!helpers.responseFormatter.checkBody(body)) {
          msg.reply("We coudn't find that gamertag. Please try again.");
          return;
        }

        // Format data
        //const data = helpers.responseFormatter.profileUsers(body);

        var v = JSON.parse(body).profileUsers[0].settings[9].value;

        request(
          {
            url:
              "http://dlassets.xboxlive.com/public/content/ppl/colors/00003.json"
          },
          function(error, response, body) {
            console.warn(`HTTP Response ${response.statusCode}`);
            // Check the HTTP Response Code.
            if (response.statusCode !== 200) {
              msg.reply("Sorry, I coudn't get your request from the API.");
              console.warn(`HTTP Response ${response.statusCode}`);
              return;
            }

            const val = JSON.parse(body);

            request(
              {
                url: `http://localhost:3000/usercolors/define/${encodeURIComponent(
                  val.primaryColor
                )}/${encodeURIComponent(
                  val.secondaryColor
                )}/${encodeURIComponent(val.tertiaryColor)}`
              },
              function(error, response, body) {
                console.log(body);
                sharp(Buffer.from(body))
                  .png()
                  .toBuffer()
                  .then(data =>
                    msg.channel.send({
                      files: [
                        {
                          name: "image.png",
                          attachment: data
                        }
                      ]
                    })
                  );
              }
            );
          }
        );
      });
    }
  });
};
