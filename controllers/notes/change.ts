import mergeChanges = require("../../lib/note/merge-changes");
import db = require("../../lib/db");

interface IData {
    doc: number, id: string, action: string,
    content?: string, parent?: string, version?: number
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {
    
    if (Object.keys(socket.rooms).indexOf(''+data.doc) == -1) {
        fn(true);
        return;
    }
    if (["CREATE", "DELETE", "UPDATE", "SET_FLAGS"].indexOf(data.action) == -1) {
        fn(true, "Invalid action");
        return;
    }

    let sql: string = `
        SELECT (
            SELECT COUNT(doc_id) FROM documents 
            WHERE (doc_id = ? AND user_id = ?) OR doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? 
                AND can_${data.action == "CREATE" ? "write" : (data.action == "DELETE" ? "delete" : "update")} = 1
            )
        ) as has_access, (
            SELECT COUNT(doc_id) FROM document_changes WHERE doc_id = ?
        ) as version_count, (
            SELECT MIN(version) FROM document_changes WHERE doc_id = ?
        ) as oldest_version
    `;
    let vars = [
        data.doc, socket.session.uid,
        data.doc, socket.session.uid,
        data.doc,
        data.doc
    ];
    
    db(cn => cn.query(sql, vars, (err, rows) => {
        if (err) {
            cn.release();
            fn(true);
        }
        else if (rows[0].has_access == 0) {
            cn.release();
            fn(true, "You do not have sufficient privileges for this action");
        }
        else {
            let version = Date.now();
            let change = JSON.stringify(data);

            sql = `
                INSERT INTO document_changes (doc_id, version, change_object) VALUES (?, ?, ?)
            `;
            cn.query(sql, [data.doc, version, change], (err, result) => {
                if (err || !result.affectedRows) {
                    cn.release();
                    fn(true);
                }
                else {
                    data.version = version;
                    fn(false, version);
                    socket.broadcast.to(''+data.doc).emit("note change", data);

                    // If oldest version is over 30 minutes old, merge changes with document
                    if (Date.now() > (new Date(rows[0].oldest_version + (1800000))).getTime())
                        mergeChanges(data.doc, cn);
                    // If 100+ changes, merge changes with document
                    else if (rows[0].version_count >= 100)
                        mergeChanges(data.doc, cn);
                    else
                        cn.release();
                }
            });
        }
    }));

};