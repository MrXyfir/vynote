const db = require("lib/db");

/*interface IData {
    doc: number, uid: number,
    permissions: {
        write: boolean, update: boolean, delete: boolean
    }
};*/

module.exports = function(socket, data, fn) {

    if (Date.now() > socket.session.subscription) {
        fn(true, "Free members cannot set contributor permissions");
        return;
    }

    let sql = `
        UPDATE document_contributors SET can_write = ?, can_delete = ?, can_update = ? 
        WHERE doc_id IN (
            SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
        ) AND user_id = ?
    `;
    let vars = [
        +data.permissions.write, +data.permissions.delete, +data.permissions.update,
        data.doc, socket.session.uid,
        data.uid
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));

}