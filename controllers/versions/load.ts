import toSql = require("../../lib/notes-convert/to-sql");
import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, name: string, fn: Function) => {

    if (Object.keys(socket.rooms).indexOf(''+doc) == -1) {
        fn(true);
        return;
    }

    let sql: string = `
        SELECT (
            SELECT doc_type FROM documents WHERE doc_id = ?
        ) as doc_type, (
            SELECT COUNT(doc_id) FROM documents WHERE (doc_id = ? AND user_id = ?)
            OR (doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ?
            ))
        ) as owns_document, (
            SELECT COUNT(doc_id) FROM document_versions WHERE doc_id = ? AND name = ?
        ) as version_exists
    `;
    let vars = [
        doc,
        doc, socket.session.uid,
        doc, socket.session.uid,
        doc, name
    ];

    db(cn => cn.query(sql, vars, (err, rows) => {
        if (err) {
            cn.release();
            fn(true);
        }
        else if (rows[0].version_exists != 1) {
            cn.release();
            fn(true, "Version does not exist");
        }
        else if (rows[0].owns_document != 1) {
            cn.release();
            fn(true, "You do not own or have access to this document");
        }
        else {
            // Note document
            if (rows[0].doc_type == 1) {
                // Grab note's content text
                sql = `SELECT content FROM document_versions WHERE doc_id = ? AND name = ?`;
                cn.query(sql, [doc, name], (err, rows) => {

                    // Convert note text to an SQL 'INSERT INTO' query
                    let content: string[] = rows[0].content.split("\r\n"); rows = null;
                    let insert: string = toSql(doc, content); content = null;

                    // Delete all elements in note_elements for doc_id
                    sql = `DELETE FROM note_elements WHERE doc_id = ?`;
                    cn.query(sql, [doc], (err, result) => {
                        // Insert notes in database
                        cn.query(insert, (err, result) => {
                            cn.release();

                            fn(!!err || !result.affectedRows);
                        });
                    });
                });
            }

            // Non-note document
            else {
                sql = `
                    UPDATE document_content SET content = (
                        SELECT content FROM document_versions WHERE doc_id = ? AND name = ?
                    ) WHERE doc_id = ?
                `;
                vars = [
                    doc, name,
                    doc
                ];

                cn.query(sql, vars, (err, result) => {
                    cn.release();

                    fn(!!err || !result.affectedRows);
                });
            }
        }
    }));
};