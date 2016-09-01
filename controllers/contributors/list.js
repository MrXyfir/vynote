const db = require("lib/db");

module.exports = function(socket, doc, fn) {

    // Get email and user_id of contributors to doc
    let sql = `
        SELECT email, user_id FROM users WHERE user_id IN (
            SELECT user_id FROM document_contributors WHERE doc_id IN (
                SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
            )
        )
    `;
    let vars = [ doc, socket.session.uid ];

    db(cn => cn.query(sql, vars, (err, users) => {
        if (err) {
            cn.release();
            fn(true);
        }
        // Will also be hit if doc_id/user_id doesn't match/exist
        else if (!users.length) {
            cn.release();
            fn(false, []);
        }
        // Get the permissions of contributors
        else {
            sql = `
                SELECT user_id, can_write, can_update, can_delete 
                FROM document_contributors WHERE doc_id = ?
            `;
            vars = [ doc ];

            cn.query(sql, vars, (err, rows) => {
                cn.release();

                // Add permissions object to users
                users.forEach((user, i) => {
                    rows.forEach(row => {
                        if (user.user_id == row.user_id) {
                            users[i].permission = {
                                write: !!row.can_write, update: !!row.can_update,
                                delete: !!row.can_delete
                            }
                        }
                    });
                });

                fn(false, users);
            });
        }
    }));
    
}