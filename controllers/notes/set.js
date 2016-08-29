import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, content: string, fn: Function) => {

    db(cn => {
        let sql: string = `
            UPDATE document_content SET content = ? WHERE doc_id IN (
                SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
            )
        `;
        cn.query(sql, [content, doc, socket.session.uid], (err, result) => {
            if (err || !result.affectedRows) {
                cn.release();
                fn(true);
            }
            else {
                sql = `DELETE FROM document_changes WHERE doc_id = ?`;
                cn.query(sql, [doc], (err, result) => cn.release());

                fn(false);
            }
        });
    });

};