import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, email: string, fn: Function) => {

    let sql: string = `
        INSERT INTO document_contributors (user_id, doc_id, encrypt)
        SELECT users.user_id, documents.doc_id, documents.encrypt
        FROM users, documents
        WHERE (users.email = ?) AND (documents.doc_id = ? AND documents.user_id = ?)
    `;
    let vars = [
        email, doc, socket.session.uid
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));

};