import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, name: string, fn: Function) => {

    if (Object.keys(socket.rooms).indexOf(''+doc) == -1) {
        fn(true);
        return;
    }

    let sql: string = `
        SELECT (
            SELECT COUNT(doc_id) FROM documents WHERE (doc_id = ? AND user_id = ?)
            OR (doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? 
                AND can_write = 1 AND can_update = 1 AND can_delete = 1
            ))
        ) as has_access, (
            SELECT COUNT(doc_id) FROM document_versions WHERE doc_id = ? AND name = ?
        ) as version_exists, (
            SELECT doc_type FROM documents WHERE doc_id = ?
        ) as doc_type
    `;
    let vars = [
        doc,
        doc, socket.session.uid,
        doc, socket.session.uid,
        doc, name,
        doc
    ];

    db(cn => cn.query(sql, vars, (err, rows) => {
        if (err) {
            cn.release();
            fn(true);
        }
        else if (rows[0].version_exists != 1) {
            cn.release();
            fn(true, "Version does not exist");
        }
        else if (rows[0].has_access != 1) {
            cn.release();
            fn(true, "You do not own or have sufficient access to this document");
        }
        else {
            sql = `
                UPDATE document_content SET content = (
                    SELECT content FROM document_versions WHERE doc_id = ? AND name = ?
                ) WHERE doc_id = ?
            `;
            vars = [
                doc, name,
                doc
            ];

            cn.query(sql, vars, (err, result) => {
                if (!!err || !result.affectedRows) {
                    cn.release();
                    fn(true);
                }
                else {
                    sql = "DELETE FROM document_changes WHERE doc_id = ?";
                    cn.query(sql, [doc], (err, result) => {
                        cn.release();

                        fn(false);

                        if (rows[0].doc_type == 1)
                            socket.broadcast.to('' + doc).emit("note change", { action: "RELOAD" });
                        else
                            socket.broadcast.to('' + doc).emit("update content", { action: "RELOAD" });
                    });
                }
            });
        }
    }));
};