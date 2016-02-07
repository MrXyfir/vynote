import db = require("../../lib/db");

export = (socket: SocketIO.Socket, note: number, fn: Function) => {

    db(cn => {
        // Release connection, output to client, ?join room
        const finish = (output: any[], join: boolean) => {
            cn.release();
            fn(output);

            if (join) socket.join(''+note);
        };

        // Grab note elements where doc_id is in documents or document_contributors with user's ID
        let sql: string = "SELECT parent_id, note_id, level, content, flags FROM note_elements "
            + "WHERE doc_id IN (SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?)"
            + "OR doc_id IN (SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ?)";

        cn.query(sql, [note, socket.session.uid, note, socket.session.uid], (err, rows) => {
            if (err) {
                finish([], false);
            }
            // Determine if no rows because note has no elements
            // or because user cannot access note
            else if (!rows.length) {
                sql = "SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?";

                cn.query(sql, [note, socket.session.uid], (err, rows) => {
                    if (err || !rows.length) {
                        sql = "SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ?";

                        cn.query(sql, [note, socket.session.uid], (err, rows) => {
                            // Note doesn't exist or user isn't a contributor or owner
                            if (err || !rows.length)
                                finish([], false);
                            // User is a contributor on note that has no elements
                            else
                                finish([], true);
                        });
                    }
                    // User owns note but it has no elements yet
                    else {
                        finish([], true);
                    }
                });
            }
            // Return elements and have user join room
            else {
                finish(rows, true);
            }
        });
    });

};