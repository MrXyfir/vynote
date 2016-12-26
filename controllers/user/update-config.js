const db = require("lib/db");

module.exports = function(socket, config, fn) {

    if (Date.now() > socket.session.subscription) {
        fn(true, "Free members cannot modify this configuration");
    }

    const sql = `
        UPDATE users SET config = ? WHERE user_id = ?
    `, vars = [
        JSON.stringify(config), socket.session.uid
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));

}