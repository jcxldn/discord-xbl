const helpers = require("../helpers");

module.exports = function(client) {
  client.on("message", msg => {
    if (msg.content === helpers.formatCommand("pro")) {
      msg.reply("Pong!");
    }
  });
};
