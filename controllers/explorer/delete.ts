import db = require("../../lib/db");

export = (socket: SocketIO.Socket, objType: number, id: number, fn: Function) => {

    // Object we're deleting is not a folder
    if (objType != 1) {
        let table: string = objType == 2 ? "documents" : "document_contributors";
        let sql: string = "DELETE FROM " + table + " WHERE doc_id = ? AND user_id = ?";

        db(cn => cn.query(sql, [id, socket.session.uid], (err, result) => {
            cn.release();

            fn(!!err || !result.affectedRows);
        }));
    }
    // Object is root folder
    else if (id == 0) {
        fn(true, "Cannot delete root folder");
    }
    // Object we're deleting is a non-root folder
    // We currently do NOT allow users to delete folders containing sub-folders
    // Due to foreign keys pointing to folder_id, contained documents are automatically deleted
    else {
        db(cn => {
            let sql: string = "SELECT COUNT(folder_id) as count FROM folders WHERE parent_id = ? AND user_id = ?";

            cn.query(sql, [id, socket.session.uid], (err, rows) => {
                if (err || rows[0].count > 0) {
                    cn.release();
                    fn(true, "Cannot delete folders that contain sub-folders");
                }
                else {
                    sql = "DELETE FROM folders WHERE folder_id = ? AND user_id = ?";
                    cn.query(sql, [id, socket.session.uid], (err, result) => {
                        cn.release();

                        fn(!!err || !result.affectedRows);
                    });
                }
            });
        });
    }

};