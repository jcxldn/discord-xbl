// File to dynamically include all routes
// then just use 'require('./routes')(client);'

var fs = require("fs");

module.exports = function(client) {
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file == "index.js") return;
    var name = file.substr(0, file.indexOf("."));
    require("./" + name)(client);
  });
};
