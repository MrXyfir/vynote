const db = require("lib/db");

module.exports = function(socket, doc, name, fn) {

    if (Object.keys(socket.rooms).indexOf(''+doc) == -1) {
        fn(true);
        return;
    }

    let sql = `
        DELETE FROM document_versions WHERE doc_id IN (
            SELECT doc_id FROM documents WHERE (doc_id = ? AND user_id = ?) 
            OR (doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ?
            ))
        ) AND name = ?
    `;
    let vars = [
        doc, socket.session.uid,
        doc, socket.session.uid,
        name
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));

}