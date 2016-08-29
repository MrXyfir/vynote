const mysql = require("mysql");

const config = require("config").database;

// Set global["__mysql"] equal to a client pool
if (global["__mysql"] === undefined) {
    global["__mysql"] = mysql.createPool(config.mysql);
}

module.exports = function(fn) {
    global["__mysql"].getConnection((err, cn) => fn(cn));
};