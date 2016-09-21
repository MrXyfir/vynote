const db = require("lib/db");

module.exports = function(fn) {

    let sql = `
        DELETE FROM access_codes WHERE NOW() > expires
    `;

    db(cn => cn.query(sql, (err, result) => {
        cn.release();
        fn(err);
    }));

}