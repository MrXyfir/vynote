import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, email: string, fn: Function) => {

    let sql: string = `
        DELETE FROM document_contributors WHERE doc_id IN (
            SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
        )
        AND user_id IN (
            SELECT user_id FROM users WHERE email = ?
        )
    `;
    let vars = [
        doc, socket.session.uid,
        email
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));

};