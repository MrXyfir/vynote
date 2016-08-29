import db = require("../../lib/db");

export = (socket: SocketIO.Socket, name: string, fn: Function) => {

    let sql: string = "DELETE FROM shortcuts WHERE user_id = ? AND name = ?";

    db(cn => cn.query(sql, [socket.session.uid, name], (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));
};