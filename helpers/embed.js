const { prefix } = require("../index");

function getSha() {
  if (process.env.GIT_COMMIT) {
    return process.env.GIT_COMMIT.toString().substring(0, 7);
  } else {
    // Not the docker container, fallback to git CLI.
    return require("child_process")
      .execSync("git rev-parse --short HEAD")
      .toString()
      .trim();
  }
}

function setEmbedStandards(embed, client) {
  embed.setFooter(
    `Xbox Live (${getSha()}.a2) | ${prefix}`,
    client.user.avatarURL
  );
  embed.setColor(3447003);
  embed.setTimestamp();

  return embed;
}

module.exports = { setEmbedStandards };
