import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, encrypt: string, fn: Function) => {

    let sql: string = `
        SELECT content FROM document_content WHERE doc_id IN (
            SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ? AND encrypt = ?
        )
        OR doc_id IN (
            SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? AND encrypt = ?
        )
    `;

    let vars = [
        doc, socket.session.uid, encrypt,
        doc, socket.session.uid, encrypt
    ];

    db(cn => cn.query(sql, vars, (err, rows) => {
        cn.release();

        if (err || !rows.length) {
            fn(true);
        }
        else {
            fn(false, rows[0].content);
            socket.join(''+doc);
        }
    }));
};