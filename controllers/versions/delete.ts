import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, name: string, fn: Function) => {

    let sql: string = `DELETE FROM document_versions WHERE doc_id = ? AND name = ?`;

    db(cn => cn.query(sql, [doc, name], (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));
};