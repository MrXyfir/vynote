import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, encrypt: string, fn: Function) => {

    db(cn => {
        // Check if user has access to document
        let sql: string = `
            SELECT (
                SELECT COUNT(doc_id) FROM documents WHERE (
                    doc_id = ? AND user_id = ? AND encrypt = ?
                )
                OR doc_id IN (
                    SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? AND encrypt = ?
                )
            ) as has_access
        `;
        // Encrypt is blank for all non-encrypted files
        // Encrypt should be equal to encrypt("KEY", userEncKey) for encrypted files
        let vars = [
            doc, socket.session.uid, encrypt,
            doc, socket.session.uid, encrypt
        ];

        cn.query(sql, vars, (err, rows) => {
            if (err) {
                cn.release();
                fn(true);
            }
            else if (rows[0].has_access == 0) {
                cn.release();
                fn(true, "You do not have access to this document");
            }
            else {
                sql = "SELECT content FROM document_content WHERE doc_id = ?";
                cn.query(sql, [doc], (err, rows) => {
                    sql = `
                        SELECT change_object, version FROM document_changes WHERE doc_id = ?
                        ORDER BY version ASC
                    `;
                    cn.query(sql, [doc], (err, changes) => {
                        cn.release();
                        fn(false, {
                            content: rows[0].content, changes
                        });

                        socket.join(''+doc);
                    });
                });
            }
        });
    });

};