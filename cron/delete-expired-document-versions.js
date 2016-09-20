const db = require("lib/db");

module.exports = function(fn) {

    let sql = `
        DELETE FROM document_versions WHERE NOW() > DATE_ADD(created, INTERVAL 7 DAY)
    `;

    db(cn => cn.query(sql, (err, result) => {
        cn.release();
        fn(err);
    }));

}