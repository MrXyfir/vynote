const db = require("lib/db");

module.exports = function(socket, name, fn) {

    let sql = "DELETE FROM shortcuts WHERE user_id = ? AND name = ?";

    db(cn => cn.query(sql, [socket.session.uid, name], (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));

}