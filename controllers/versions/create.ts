import db = require("../../lib/db");

// Convert note_elements rows to object via to-object, then to text
import buildNoteObject = require("../../lib/notes-convert/to-object");
import objectToText = require("../../lib/notes-convert/to-text");

export = (socket: SocketIO.Socket, doc: number, name: string, fn: Function) => {

    if (Object.keys(socket.rooms).indexOf(''+doc) == -1) {
        fn(true);
        return;
    }

    if (Date.now() > socket.session.subscription) {
        fn(true, "Free members cannot create versions");
        return;
    }

    let sql: string = `
        SELECT (
            SELECT COUNT(doc_id) FROM document_versions WHERE doc_id = ?
        ) as version_count, (
            SELECT COUNT(doc_id) FROM document_versions WHERE doc_id = ? AND name = ?
        ) as version_exists, (
            SELECT COUNT(doc_id) FROM documents WHERE (doc_id = ? AND user_id = ?)
            OR (doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ?
            ))
        ) as owns_document, (
            SELECT doc_type FROM documents WHERE doc_id = ?
        ) as doc_type
    `;
    let vars = [
        doc,
        doc, name,
        doc, socket.session.uid,
        doc, socket.session.uid,
        doc
    ];

    db(cn => cn.query(sql, vars, (err, rows) => {
        if (err) {
            cn.release();
            fn(true);
        }
        else if (rows[0].version_count >= 10) {
            cn.release();
            fn(true, "Document cannot have more than 10 versions");
        }
        else if (rows[0].version_exists == 1) {
            cn.release();
            fn(true, "A version with that name already exists");
        }
        else if (rows[0].owns_document != 1) {
            cn.release();
            fn(true, "You do not own or have access to this document");
        }
        else {
            // Non-note document
            if (rows[0].doc_type != 1) {
                sql = `
                    INSERT INTO document_versions (doc_id, name, content) 
                    SELECT ?, ?, (
                        SELECT content FROM document_content WHERE doc_id = ?
                    )
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
            
            // Note document
            else {
                sql = `SELECT parent_id, note_id, content FROM note_elements WHERE doc_id = ?`;
                cn.query(sql, [doc], (err, rows) => {
                    sql = `
                        INSERT INTO document_versions (doc_id, name, content) 
                        VALUES (?, ?, ?)
                    `;
                    vars = [
                        doc, name, objectToText(buildNoteObject(rows))
                    ];

                    cn.query(sql, vars, (err, result) => {
                        cn.release();

                        fn(!!err || !result.affectedRows);
                    });
                });
            }
        }
    }));
};