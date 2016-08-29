const db = require("lib/db");

module.exports = function(socket, doc, fn) {

    let sql = `
        INSERT INTO documents (user_id, doc_type, folder_id, name, encrypt, created, syntax, color)
        SELECT user_id, doc_type, folder_id, CONCAT(name, " - Copy"), encrypt, UNIX_TIMESTAMP(NOW()), syntax, color
        FROM documents WHERE doc_id = ? AND user_id = ?
    `;
    
    db(cn => cn.query(sql, [doc, socket.session.uid], (err, result) => {
        if (err || !result.affectedRows) {
            cn.release();
            fn(true);
        }
        else {
            let id = result.insertId;

            sql = `
                INSERT INTO document_content (doc_id, content)
                SELECT ?, content FROM document_content WHERE doc_id = ?
            `;

            cn.query(sql, [id, doc], (err, result) => {
                cn.release();
                fn(false, id);
            });
        }
    }));

}