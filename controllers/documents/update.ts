import mergeChanges = require("../../lib/document/merge-changes");
import db = require("../../lib/db");

interface IData {
    doc?: number, changes: any[], version?: number
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {

    if (Object.keys(socket.rooms).indexOf('' + data.doc) == -1) {
        fn(true);
        return;
    }

    // Determine what privileges the user needs
    let insert: boolean = false, remove: boolean = false;
    for (let change in data.changes) {
        if (insert && remove)
            break;
        else if (change.insert)
            insert = true;
        else if (change.remove)
            remove = true;
    }

    let sql: string = `
        SELECT (
            SELECT COUNT(doc_id) FROM documents 
            WHERE (doc_id = ? AND user_id = ?) OR doc_id IN (
                SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ?
                ${insert ? "AND can_write = 1": ""} ${remove ? "AND can_delete = 1" : ""}
            )
        ) as has_access, (
            SELECT COUNT(doc_id) FROM document_changes WHERE doc_id = ?
        ) as version_count, (
            SELECT MIN(version) FROM document_changes WHERE doc_id = ?
        ) as oldest_version
    `;
    let vars = [
        data.doc, socket.session.uid, // owns
        data.doc, socket.session.uid, // has access
        data.doc, // version count
        data.doc // oldest version
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
            delete data.doc;
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
                    socket.broadcast.to('' + data.doc).emit("update content", data);

                    if (rows[0].version_count == 0)
                        cn.release();
                    // If oldest version is over 60 minutes old, merge changes with document
                    else if (Date.now() > (new Date(rows[0].oldest_version + (3600000))).getTime())
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