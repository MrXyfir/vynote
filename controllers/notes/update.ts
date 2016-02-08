import db = require("../../lib/db");

interface IData {
    note: number, element: number, content: string
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {

    if (data.content.toString().length > 300) {
        fn(false);
        return;
    }

    let sql: string = `
        UPDATE note_elements SET content = ?
        WHERE (note_id = ?) 
        AND (
            doc_id IN (
                SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
            )
            OR
            doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? AND can_update = 1
            )
        )
    `;

    let vars = [
        data.content,
        data.element,
        data.note, socket.session.uid,
        data.note, socket.session.uid
    ];

    db(cn => cn.query(sql, vars, (err, rows) => {
        cn.release();

        if (err || !rows.affectedRows) {
            fn(true);
        }
        else {
            fn(false);
            socket.broadcast.to(''+data.note).emit("update element", data);
        }
    }));

};