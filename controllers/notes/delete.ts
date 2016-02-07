import db = require("../../lib/db");

export = (socket: SocketIO.Socket, note: number, elements: number[], fn: Function) => {

    let sql: string = `
        DELETE FROM note_elements 
        WHERE (note_id IN (?)) 
        AND (
            doc_id IN (
                SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
            )
            OR
            doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? AND can_delete = 1
            )
        )`;
    let vars = [
        elements.join(", "), note, socket.session.uid, note, socket.session.uid
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();

        if (err || !result.affectedRows) {
            fn(true);
        }
        else {
            fn(false);
            socket.broadcast.to(''+note).emit("delete elements", elements);
        }
    }));

};