const Discord = require("discord.js");
const request = require("request");
const console = require("prefix-logger")("route.stats");
const helpers = require("../helpers");

const gameMap = {
  motorsport5: 2067126551,
  motorsport6: 1694054782,
  motorsport7: 1999574456,
  horizon2: 446059611,
  horizon3: 1289871275,
  horizon4: 1985701699,
  halomcc: 1144039928,
  shadowtombraider: 913783821,
  risetombraider: 434412541,
  metroexodus: 1045960524,
  titanfall2: 1145574011,
  titanfall: 1292135256,
  battlefield1: 1386529057,
  battlefield4: 1484511986,
  deusex: 1650442817,
  battlefront: 1681220621,
  battlefront2: 833960563,
  pvzgw: 860666361,
  pvzgw2: 728655825
};

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content.startsWith(helpers.formatCommand("stats"))) {
      const split = msg.content.split(" ");
      const game = split[2];
      const gamertag = msg.content.split(
        helpers.formatCommand("stats") + ` ${game} `
      )[1];

      // get the names of all supported games
      gameMapKeys = Object.keys(gameMap);

      // if message was just '!xbox stats'
      if (msg.content == helpers.formatCommand("stats")) {
        msg.channel.send(
          "Usage:  `!xbox stats <game> <gamertag>`\nGame Types:  `" +
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
          "Please provide a gamertag. `!xbox stats " +
            gameMapKeys[Object.keys(gameMap).indexOf(game)] +
            " <gamertag>`"
        );
        return;
      }

      const url = `https://xbl-api.prouser123.me/userstats/gamertag/${gamertag}/titleid/${gameMap[game]}`;

      helpers.debug.level1(`url.1: ${url}`, "route.stats");

      request(url, function(error, response, body) {
        // Check the HTTP Response Code.
        if (response.statusCode !== 200) {
          msg.reply("Sorry, I coudn't get your request from the API.");
          console.warn(`HTTP Response ${response.statusCode}`);
          return;
        }

        const json = JSON.parse(response.body);

        const embed = new Discord.RichEmbed();
        helpers.setEmbedStandards(embed, client);
        //.setAuthor("Game Stats", client.user.avatarURL)
        //.setThumbnail(data.pictureURL)
        // Set footer text, icon and timestamp

        // Add stats to array
        const stats = [];

        // KD (Halo:MCC)
        let kd = {
          k: undefined,
          d: undefined
        };

        // Main stat location
        json.groups.map(function(groups) {
          groups.statlistscollection.map(function(statcollection) {
            statcollection.stats.map(function(stat) {
              // Remove empty stat values
              if (stat.value == undefined) return;
              // Push the stat to the array
              stats.push({
                name: stat.name,
                displayName: stat.properties.DisplayName,
                value: stat.value
              });

              // KD (Halo:MCC)
              if (stat.name == "TotalMultiplayerDeaths") kd.d = stat.value;
              if (stat.name == "TotalMultiplayerKills") kd.k = stat.value;
            });
          });
        });

        // Alternate stat location - usually Minutes Played
        json.statlistscollection.map(function(statcollection) {
          statcollection.stats.map(function(stat) {
            // Remove empty stat values
            if (stat.value == undefined) return;
            // Push the stat to the array
            stats.push({
              name: stat.name,
              displayName: stat.properties.displayName,
              value: stat.value
            });
          });
        });

        // KD (Halo:MCC)
        if (kd.d != undefined && kd.k != undefined) {
          stats.push({
            //name: "Multiplayer KD",
            displayName: "Multiplayer K/D Ratio",
            value: (kd.k / kd.d).toString().substring(0, 4)
          });
        }

        helpers.debug.level2(JSON.stringify(stats), "route.stats.res");

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
        helpers.debug.level1(`url.2: ${url}`, "route.stats");
        request(url, function(error, response, body) {
          const json2 = JSON.parse(response.body);
          embed.setThumbnail(json2.titles[0].displayImage);

          // Get user's profile pic
          const url = `https://xbl-api.prouser123.me/profile/gamertag/${gamertag}`;
          helpers.debug.level1(`url.3: ${url}`, "route.stats");
          request(url, function(error, response, body) {
            embed.setAuthor(
              `${gamertag}'s ${json2.titles[0].name} Stats`,
              JSON.parse(response.body).profileUsers[0].settings[2].value
            );
            msg.channel.send({ embed });
          });
        });
      });
    }
  });
};
