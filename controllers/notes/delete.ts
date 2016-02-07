import db = require("../../lib/db");

export = (socket: SocketIO.Socket, note: number, elements: number[], fn: Function) => {

    let sql: string = "DELETE FROM note_elements WHERE note_id IN (?) AND doc_id IN "
        + "(SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?)";

    db(cn => cn.query(sql, [elements.join(", "), note, socket.session.uid], (err, result) => {
        cn.release();

        if (err || !result.affectedRows) {
            fn(true);
        }
        else {
            fn(false);
            socket.broadcast.to(note).emit("delete elements", elements);
        }
    }));

};