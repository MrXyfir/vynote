import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, email: string, fn: Function) => {

    let sql: string = `
        SELECT (
            SELECT user_id FROM users WHERE email = ?
        ) as user_id, (
            SELECT COUNT(doc_id) FROM document_contributors WHERE doc_id = ?
        ) as user_count, (
            SELECT folder_id FROM folders WHERE user_id IN (
                SELECT user_id FROM users WHERE email = ?
            ) AND parent_id = 0 ORDER BY folder_id ASC LIMIT 1
        ) as folder_id
    `;
    let vars = [
        email,
        doc,
        email
    ];

    db(cn => cn.query(sql, vars, (err, rows) => {
        if (err) {
            cn.release();
            fn(true);
        }
        // Free members cannot add more than 2 users to a document
        else if (rows[0].user_count > 2 && Date.now() > socket.session.subscription) {
            cn.release();
            fn(true, "Free members can only add up to 2 other users to documents");
        }
        else if (rows[0].user_id == null) {
            cn.release();
            fn(true, "A user with that email doesn't exist");
        }
        else if (rows[0].folder_id == null) {
            cn.release();
            fn(true, "User does not have any folders to add document to");
        }
        else {
            sql = `
                INSERT INTO document_contributors (user_id, doc_id, folder_id, encrypt, can_write, can_delete, can_update) 
                SELECT ?, doc_id, ?, encrypt, 1, 1, 1 
                FROM documents WHERE doc_id = ? AND user_id = ?
            `;
            vars = [
                rows[0].user_id, rows[0].folder_id,
                doc, socket.session.uid
            ];

            cn.query(sql, vars, (err, result) => {
                cn.release();

                if (!!err || !result.affectedRows)
                    fn(true);
                else
                    fn(false, rows[0].user_id);
            });
        }
    }));

};