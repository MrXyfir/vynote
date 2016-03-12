import toObject = require("../../lib/notes-convert/to-object");
import db = require("../../lib/db");

export = (socket: SocketIO.Socket, note: number, content: string[], fn: Function) => {

    if (Object.keys(socket.rooms).indexOf('' + note) == -1) {
        fn(true);
        return;
    }

    if (Date.now() > socket.session.subscription) {
        fn(true, "Free members cannot import note documents");
        return;
    }

    // Ensure that user owns the note
    let sql: string = `
        SELECT COUNT(doc_id) as has_access FROM documents 
        WHERE (doc_id = ? AND user_id = ?) 
        OR (doc_id IN (
            SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? 
            AND can_write = 1 AND can_delete = 1 AND can_update = 1
        ))
    `;
    let vars = [
        note, socket.session.uid,
        note, socket.session.uid
    ];

    db(cn => cn.query(sql, vars, (err, rows) => {
        if (err || rows[0].has_access != 1) {
            cn.release();
            fn(true, "You do not have access to this document");
        }
        else {
            let insert: string = JSON.stringify(toObject(content));
            content = null;

            sql = "UPDATE document_content SET content = ? WHERE doc_id = ?";
            cn.query(sql, [insert, note], (err, result) => {
                if (err || !result.affectedRows) {
                    cn.release();
                    fn(true);
                }
                else {
                    sql = "DELETE FROM document_changes WHERE doc_id = ?";
                    cn.query(sql, [note], (err, result) => {
                        cn.release();
                        fn(false);

                        socket.broadcast.to('' + note).emit("note change", {
                            action: "OVERWRITE", content: insert
                        });
                    });
                }
            });
        }
    }));
};