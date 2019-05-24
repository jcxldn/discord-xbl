const Discord = require("discord.js");
const { prefix } = require("../index");
const { setEmbedStandards } = require("./embed");

function sendNonRichUserEmbed(client, msg, json) {
  msg.channel.send({
    embed: {
      color: 3447003,
      author: {
        name: json.profileUsers[0].settings[2].value,
        icon_url: json.profileUsers[0].settings[0].value
      },
      //title: "This is an embed",
      //url: "http://google.com",
      //description:
      //  "This is a test embed to showcase what they look like and what they can do.",
      fields: [
        {
          name: "Gamerscore",
          value: `${json.profileUsers[0].settings[1].value}G`
        },
        {
          name: "Subscription Type",
          value: `Xbox Live ${json.profileUsers[0].settings[3].value}`
        },
        {
          name: "Repuation",
          value: json.profileUsers[0].settings[4].value.split("Player")[0]
        }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "Xbox Live"
      }
    }
  });
}

function sendRichUserEmbed(client, msg, data) {
  const author =
    data.realName === undefined
      ? data.gamertag
      : `${data.gamertag} (${data.realName})`;

  const embed = new Discord.RichEmbed()
    .setAuthor(author, client.user.avatarURL)
    .setThumbnail(data.pictureURL);

  setEmbedStandards(embed, client);

  // Add fields
  if (data.presenceState !== undefined) {
    if (data.presenceState !== data.presenceText) {
      embed.addField("Status", `${data.presenceState} - ${data.presenceText}`);
    } else {
      embed.addField("Status", data.presenceState);
    }
  }

  embed.addField("Gamerscore", data.gamerscore);

  if (data.subscriptionType !== undefined) {
    // create the subscription message
    let subscriptionMessage = `Xbox Live ${data.subscriptionType}`;
    if (data.tenure === 1) {
      console.log("t1");
      subscriptionMessage += ` (${data.tenure} year)`;
    } else if (data.tenure > 1) {
      console.log("t2");
      subscriptionMessage += ` (${data.tenure} years)`;
    }
    // add the field
    embed.addField("Subscription", subscriptionMessage);
  }

  embed.addField("Reputation", data.reputation);

  if (data.bio !== undefined) embed.addField("Bio", data.bio);
  if (data.location !== undefined) embed.addField("Location", data.location);
  if (data.watermarks !== undefined)
    embed.addField("Watermarks", data.watermarks);

  msg.channel.send({ embed });
}

module.exports = { sendRichUserEmbed, sendNonRichUserEmbed };
