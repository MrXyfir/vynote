import db = require("../../lib/db");

export = (socket: SocketIO.Socket, fn: Function) => {

    db(cn => {
        let sql: string = "SELECT email, config, subscription FROM users WHERE user_id = ?";
        cn.query(sql, [socket.session.uid], (err, rows) => {
            // Grab user's shortcuts if user has subscription
            if (socket.session.subscription > Date.now()) {
                sql = "SELECT name, content FROM shortcuts WHERE user_id = ?";
                cn.query(sql, [socket.session.uid], (err, shortcuts) => {
                    cn.release();

                    rows[0].shortcuts = shortcuts;
                    fn(rows[0]);
                });
            }
            else {
                cn.release();
                fn(rows[0]);
            }
        });
    });

};