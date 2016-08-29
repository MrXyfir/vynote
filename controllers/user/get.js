import db = require("../../lib/db");

export = (socket: SocketIO.Socket, fn: Function) => {

    if (!socket.session.uid) {
        fn(false);
        return;
    }

    db(cn => {
        let sql: string = "SELECT email, config, subscription FROM users WHERE user_id = ?";
        cn.query(sql, [socket.session.uid], (err, rows) => {
            if (err || !rows.length) {
                fn(false);
            }
            // Grab user's shortcuts if user has subscription
            else if (socket.session.subscription > Date.now()) {
                sql = "SELECT name, content FROM shortcuts WHERE user_id = ?";
                cn.query(sql, [socket.session.uid], (err, shortcuts) => {
                    cn.release();

                    rows[0].shortcuts = shortcuts;
                    fn(true, rows[0]);
                });
            }
            else {
                cn.release();
                fn(true, rows[0]);
            }
        });
    });

};