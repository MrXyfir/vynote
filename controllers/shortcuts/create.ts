import db = require("../../lib/db");

export = (socket: SocketIO.Socket, name: string, content: string, fn: Function) => {

    if (Date.now() > socket.session.subscribe) {
        fn(true);
    }
    else if (name.toString().length > 15 || content.toString().length > 300) {
        fn(true);
    }
    else {
        let sql: string = "INSERT INTO shortcuts SET ?";
        let insert = {
            user_id: socket.session.uid, name: name, content: content
        };

        db(cn => cn.sql(sql, insert, (err, result) => {
            cn.release();

            fn(!!err || !result.affectedRows);
        }));
    }
};