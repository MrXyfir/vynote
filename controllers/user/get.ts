import db = require("../../lib/db");

export = (socket: SocketIO.Socket, fn: Function) => {

    db(cn => {
        let sql: string = "SELECT email, config, subscription FROM users WHERE user_id = ?";
        cn.query(sql, [socket.session.uid], (err, rows) => {
            cn.release();

            fn(!err && rows.length == 1 ? rows[0] : {});
        });
    });

};