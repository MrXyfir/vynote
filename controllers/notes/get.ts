import db = require("../../lib/db");

export = (socket: SocketIO.Socket, note: number, encrypt: string, fn: Function) => {

    db(cn => {
        // Release connection, output to client, ?join room
        const finish = (output: any[], join: boolean) => {
            cn.release();
            fn(output);

            if (join) socket.join(''+note);
        };

        // Grab note elements where doc_id is in documents or document_contributors with user's ID
        let sql: string = `
            SELECT parent_id, note_id, content, flags FROM note_elements 
            WHERE doc_id IN (
                SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ? AND encrypt = ?
            ) 
            OR doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? AND encrypt = ?
            )
        `;
        // Encrypt is blank for all non-encrypted files
        // Encrypt should be equal to encrypt("KEY", userEncKey) for encrypted files
        let vars = [
            note, socket.session.uid, encrypt,
            note, socket.session.uid, encrypt
        ];

        cn.query(sql, vars, (err, rows) => {
            if (err) {
                finish([], false);
            }
            // Determine if no rows because note has no elements
            // or because user cannot access note
            else if (!rows.length) {
                sql = `
                    SELECT COUNT(doc_id) as has_access FROM documents 
                    WHERE (doc_id = ? AND user_id = ? AND encrypt = ?)
                    OR (doc_id IN (
                        SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? AND encrypt = ?
                    ))
                `;
                vars = [
                    note, socket.session.uid, encrypt,
                    note, socket.session.uid, encrypt
                ];

                cn.query(sql, vars, (err, rows) => {
                    // User does not have access to note
                    if (err || rows[0].has_access != 1)
                        finish([], false);
                    // User has access to note but it has no elements yet
                    else
                        finish([], true);
                });
            }
            // Return elements and have user join room
            else {
                finish(rows, true);
            }
        });
    });

};