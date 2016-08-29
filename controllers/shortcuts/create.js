import db = require("../../lib/db");

export = (socket: SocketIO.Socket, name: string, content: string, fn: Function) => {
    
    if (Date.now() > socket.session.subscription) {
        fn(true, "Free members cannot create shortcuts");
    }
    else if (name.toString().length > 15 || content.toString().length > 300) {
        fn(true, "Name or content length limit hit");
    }
    else {
        let sql: string = "INSERT INTO shortcuts SET ?";
        let insert = {
            user_id: socket.session.uid, name: name, content: content
        };

        db(cn => cn.query(sql, insert, (err, result) => {
            cn.release();

            fn(!!err || !result.affectedRows);
        }));
    }
};