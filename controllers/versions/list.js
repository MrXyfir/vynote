﻿const db = require("lib/db");

module.exports = function(socket, doc, fn) {

    let sql = `
        SELECT name, created FROM document_versions WHERE doc_id IN (
            SELECT doc_id FROM documents WHERE (doc_id = ? AND user_id = ?) 
            OR (doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ?
            ))
        ) ORDER BY created DESC
    `;
    let vars = [
        doc, socket.session.uid,
        doc, socket.session.uid
    ];

    db(cn => cn.query(sql, vars, (err, rows) => {
        cn.release();

        fn(!!err || !rows.length ? [] : rows);
    }));

}