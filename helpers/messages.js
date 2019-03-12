const Discord = require("discord.js");
const { prefix } = require("../index")

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

function sendRichUserEmbed(client, msg, json) {
  const embed = new Discord.RichEmbed()
    .setColor(3447003)
    .setAuthor(json.profileUsers[0].settings[2].value, client.user.avatarURL)
    .setThumbnail(json.profileUsers[0].settings[0].value)
    // Set footer text, icon and timestamp

    .setFooter(`Xbox Live | ${prefix}`, client.user.avatarURL)
    .setTimestamp()
    // Add fields
    .addField("Gamerscore", json.profileUsers[0].settings[1].value)
    .addField("Subscription", `Xbox Live ${json.profileUsers[0].settings[3].value}`)
    .addField("Reputation", json.profileUsers[0].settings[4].value.split("Player")[0]);

  msg.channel.send({ embed });
}

module.exports = { sendRichUserEmbed, sendNonRichUserEmbed };
