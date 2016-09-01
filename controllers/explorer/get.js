const db = require("lib/db");

module.exports = function(socket, fn) {

    db(cn => {
        // Grab all of user's folders
        let sql = `
            SELECT parent_id, folder_id, name, color FROM folders WHERE user_id = ?
        `;

        cn.query(sql, [socket.session.uid], (err, rows) => {
            let response = {
                folders: rows, documents: []
            };

            // User won't have documents without folders
            if (!rows.length) {
                cn.release();
                fn(response);
                return;
            }

            // Grab info for all of user's documents
            sql = `
                SELECT
                    doc_type, doc_id, folder_id, name, IF(encrypt != '', 1, 0) as encrypted, 
                    created, syntax, color, 0 as contributor
                FROM documents WHERE user_id = ?
            `;

            cn.query(sql, [socket.session.uid], (err, rows) => {
                response.documents = rows || [];

                // Grab documents that user is a contributor on
                sql = `
                    SELECT
                        documents.doc_type, documents.doc_id, documents.name,
                        IF(documents.encrypt != '', 1, 0) as encrypted, documents.created,
                        documents.syntax, documents.color, document_contributors.folder_id,
                        1 as contributor 
                    FROM documents, document_contributors 
                    WHERE documents.doc_id IN (
                        SELECT document_contributors.doc_id FROM document_contributors WHERE user_id = 1
                    )
                `;

                cn.query(sql, [socket.session.uid], (err, rows) => {
                    cn.release();

                    if (rows !== undefined) {
                        response.documents = response.documents.concat(rows);
                    }

                    fn(response);
                });
            });
        });
    });

};