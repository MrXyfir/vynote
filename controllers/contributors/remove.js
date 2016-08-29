import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, user: number, fn: Function) => {

    let sql: string = `
        DELETE FROM document_contributors WHERE doc_id IN (
            SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
        ) AND user_id = ?
    `;
    let vars = [
        doc, socket.session.uid,
        user
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));

};