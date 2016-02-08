import db = require("../../lib/db");

export = (socket: SocketIO.Socket, folder: number, fn: Function) => {

    db(cn => {
        // Grab all of user's folders in folder
        let sql: string = `
            SELECT parent_id, folder_id, name, color 
            FROM folders WHERE user_id = ? AND parent_id = ?
        `;

        cn.query(sql, [socket.session.uid, folder], (err, rows) => {
            let response = {
                folders: rows, documents: []
            };

            // Grab info for all of user's documents in folder
            sql = `
                SELECT doc_type, doc_id, folder_id, name, IF(encrypt != '', 1, 0) as encrypted, 
                created, thumbail, syntax FROM documents WHERE user_id = ? AND folder_id = ?
            `;

            cn.query(sql, [socket.session.uid, folder], (err, rows) => {
                response.documents = rows;

                // Grab documents that user is a contributor on
                sql = `
                    SELECT doc_type, doc_id, name, IF(encrypt != '', 1, 0) as encrypted, 
                    created, thumbail, syntax FROM documents WHERE doc_id IN (
                        SELECT doc_id FROM document_contributors WHERE user_id = ? AND folder_id = ?
                    )
                `;

                cn.query(sql, [socket.session.uid, folder], (err, rows) => {
                    cn.release();

                    // Set documents' folder id to contributor's, not creator's
                    // Set contributor boolean to true
                    response.documents = response.documents.concat(rows.map(row => {
                        row.folder_id = folder;
                        row.contributor = true;

                        return row;
                    }));

                    fn(response);
                });
            });
        });
    });

};