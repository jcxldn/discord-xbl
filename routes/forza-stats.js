const Discord = require("discord.js");
const helpers = require("../helpers");
const console = require("prefix-logger")("route.forza");
const request = require("request");
const { prefix } = require("../index");

const gameMap = {
  motorsport5: 2067126551,
  motorsport6: 1694054782,
  motorsport7: 1999574456,
  horizon2: 446059611,
  horizon3: 1289871275,
  horizon4: 1985701699
};

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content.startsWith(helpers.formatCommand("forza"))) {
      const split = msg.content.split(" ");
      const game = split[2];
      const gamertag = msg.content.split(
        helpers.formatCommand("forza") + ` ${game} `
      )[1];

      //console.log(split);
      //console.log(game);
      //console.log(gamertag);

      gameMapKeys = Object.keys(gameMap);

      // if message was just '!xbox forza'
      if (msg.content == helpers.formatCommand("forza")) {
        msg.channel.send(
          "Usage:  `!xbox forza <game> <gamertag>`\nGame Types:  `" +
            Object.keys(gameMap)
              .toString()
              .replace(/,/g, ", ") +
            "`"
        );
        return;
      }

      // if message had an invalid game type
      if (gameMap[game] == undefined) {
        //msg.reply("Invalid game type, can be one of: " + Object.keys(gameMap));
        msg.channel.send(
          "Invalid game type, can be one of:\n`" +
            Object.keys(gameMap)
              .toString()
              .replace(/,/g, ", ") +
            "`"
        );
        return;
      }

      // if message did not include a gamertag
      if (gamertag == undefined) {
        msg.channel.send(
          "Please provide a gamertag. `!xbox forza " +
            gameMapKeys[Object.keys(gameMap).indexOf(game)] +
            " <gamertag>`"
        );
        return;
      }

      const url = `https://xbl-api.prouser123.me/userstats/gamertag/${gamertag}/titleid/${
        gameMap[game]
      }`;

      helpers.debug.level1(`url.1: ${url}`, "route.forza");

      request(url, function(error, response, body) {
        // Check the HTTP Response Code.
        if (response.statusCode !== 200) {
          msg.reply("Sorry, I coudn't get your request from the API.");
          console.warn(`HTTP Response ${response.statusCode}`);
          return;
        }
        // s
        const json = JSON.parse(response.body);

        const embed = new Discord.RichEmbed()
          .setColor(3447003)
          //.setAuthor("Game Stats", client.user.avatarURL)
          //.setThumbnail(data.pictureURL)
          // Set footer text, icon and timestamp
          .setFooter(`Xbox Live | ${prefix}`, client.user.avatarURL)
          .setTimestamp();

        // Add stats to array
        const stats = [];

        // Main stat location
        json.groups.map(function(groups) {
          groups.statlistscollection.map(function(statcollection) {
            statcollection.stats.map(function(stat) {
              stats.push({
                name: stat.name,
                displayName: stat.properties.DisplayName,
                value: stat.value
              });
            });
          });
        });

        // Alternate stat location - usually Minutes Played
        json.statlistscollection.map(function(statcollection) {
          statcollection.stats.map(function(stat) {
            stats.push({
              name: stat.name,
              displayName: stat.properties.displayName,
              value: stat.value
            });
          });
        });

        console.log(JSON.stringify(stats));

        // If the first stat value is undefined, the user likely hasn't played the game
        if (stats[0].value == undefined) {
          msg.reply("It looks like this user has not played this game.");
          return;
        }

        // For each stat, add a field to the embed
        stats.map(function(stat) {
          // Add a displayName for MinutesPlayed
          if (stat.name == "MinutesPlayed") stat.displayName = "Minutes Played";

          let name = stat.displayName ? stat.displayName : stat.name;
          embed.addField(name, stat.value, true);
        });

        // Get titleInfo (such as photos)
        const url = `https://xbl-api.prouser123.me/titleinfo/${gameMap[game]}`;
        helpers.debug.level1(`url.2: ${url}`, "route.forza");
        request(url, function(error, response, body) {
          const json2 = JSON.parse(response.body);
          embed.setThumbnail(json2.titles[0].displayImage);

          // Get user's profile pic
          const url = `https://xbl-api.prouser123.me/profile/gamertag/${gamertag}`;
          helpers.debug.level1(`url.3: ${url}`, "route.forza");
          request(url, function(error, response, body) {
            embed.setAuthor(
              `${gamertag}'s ${json2.titles[0].name} Stats`,
              JSON.parse(response.body).profileUsers[0].settings[2].value
            );
            msg.channel.send({ embed });
          });
          //msg.channel.send({ embed });
        });

        // Send the embed
        //msg.channel.send({ embed });
      });
    }
  });
};
