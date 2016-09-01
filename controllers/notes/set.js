const db = require("lib/db");

module.exports = function(socket, doc, content, fn) {

    db(cn => {
        let sql = `
            UPDATE document_content SET content = ? WHERE doc_id IN (
                SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
            )
        `;
        cn.query(sql, [content, doc, socket.session.uid], (err, result) => {
            if (err || !result.affectedRows) {
                cn.release();
                fn(true);
            }
            else {
                sql = `DELETE FROM document_changes WHERE doc_id = ?`;
                cn.query(sql, [doc], (err, result) => cn.release());

                fn(false);
            }
        });
    });

}