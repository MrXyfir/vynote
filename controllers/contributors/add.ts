import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, email: string, fn: Function) => {

    let sql: string = `
        INSERT INTO document_contributors (user_id, doc_id, encrypt, can_write, can_delete, can_update) 
        SELECT users.user_id, documents.doc_id, documents.encrypt, 1, 1, 1 
        FROM users, documents 
        WHERE (users.email = ?) AND (documents.doc_id = ? AND documents.user_id = ?)
    `;

    db(cn => cn.query(sql, [email, doc, socket.session.uid], (err, result) => {
        // If user does not have a subscription: make sure contributors are less than 3
        if (Date.now() > socket.session.subscription) {
            let error: boolean = !!err || !result.affectedRows;

            sql = "SELECT COUNT(doc_id) as users FROM document_contributors WHERE doc_id = ?";
            cn.query(sql, [doc], (err, rows) => {
                // Delete user we just added
                if (rows[0].users > 2) {
                    sql = `
                        DELETE FROM document_contributors WHERE doc_id = ? AND user_id IN (
                            SELECT user_id FROM users WHERE email = ?
                        )
                    `;
                    cn.query(sql, [doc, email], (err, rows) => {
                        cn.release();
                        fn(true, "Free members can only add up to 2 other users to documents");
                    });
                }
                // Less than 3 users
                else {
                    cn.release(0);
                    fn(error);
                }
            });
        }
        else {
            cn.release();

            fn(!!err || !result.affectedRows);
        }
    }));

};