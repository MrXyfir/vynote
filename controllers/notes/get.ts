import db = require("../../lib/db");

export = (socket: SocketIO.Socket, note: number, fn: Function) => {

    db(cn => {
        let sql: string = "SELECT parent_id, note_id, level, content, flags FROM note_elements "
            + "WHERE doc_id IN (SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?)";
        cn.query(sql, [note, socket.session.uid], (err, rows) => {
            cn.release();

            if (err || !rows.length)
                fn([]);
            else
                fn(rows);
        });
    });

};