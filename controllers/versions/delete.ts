import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, name: string, fn: Function) => {

    let sql: string = `
        DELETE FROM document_versions WHERE doc_id IN (
            SELECT doc_id FROM documents WHERE (doc_id = ? AND user_id = ?) 
            OR (doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ?
            ))
        ) AND name = ?
    `;
    let vars = [
        doc, socket.session.uid,
        doc, socket.session.uid,
        name
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));
};