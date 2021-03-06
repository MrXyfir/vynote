﻿const mergeNoteChanges = require("lib/note/merge-changes");
const mergeDocChanges = require("lib/document/merge-changes");
const db = require("lib/db");

module.exports = function(socket, doc, name, fn) {

    if (Object.keys(socket.rooms).indexOf(''+doc) == -1) {
        fn(true);
        return;
    }

    if (Date.now() > socket.session.subscription) {
        fn(true, "Free members cannot create versions");
        return;
    }

    let sql = `
        SELECT (
            SELECT COUNT(doc_id) FROM document_versions WHERE doc_id = ?
        ) as version_count, (
            SELECT COUNT(doc_id) FROM document_versions WHERE doc_id = ? AND name = ?
        ) as version_exists, (
            SELECT COUNT(doc_id) FROM documents WHERE (doc_id = ? AND user_id = ?)
            OR (doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ?
            ))
        ) as has_access, (
            SELECT doc_type FROM documents WHERE doc_id = ?
        ) as doc_type, (
            SELECT COUNT(doc_id) FROM document_changes WHERE doc_id = ?
        ) as changes
    `;
    let vars = [
        doc, // get version count
        doc, name, // version exists
        doc, socket.session.uid, // owns doc
        doc, socket.session.uid, // has access
        doc, // doc type
        doc // changes count
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
        else if (rows[0].has_access != 1) {
            cn.release();
            fn(true, "You do not own or have access to this document");
        }
        else {
            const createVersion = () => {
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
            };

            // Merge document changes if needed
            if (rows[0].changes > 0) {
                if (rows[0].doc_type == 1) {
                    mergeNoteChanges(doc, cn, err => {
                        if (err) {
                            cn.release();
                            fn(true);
                        }
                        else {
                            createVersion();
                        }
                    });
                }
                else {
                    mergeDocChanges(doc, cn, err => {
                        if (err) {
                            cn.release();
                            fn(true);
                        }
                        else {
                            createVersion();
                        }
                    });
                }
            }
            else {
                createVersion();
            }
        }
    }));

}