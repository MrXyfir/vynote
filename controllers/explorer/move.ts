import db = require("../../lib/db");

export = (socket: SocketIO.Socket, objType: number, id: number, to: number, fn: Function) => {

    db(cn => {
        let sql: string = "";

        // Ensure that user owns folder they want to move object to
        sql = "SELECT * FROM folders WHERE user_id = ? AND folder_id = ?";
        cn.query(sql, [socket.session.uid, to], (err, rows) => {
            if ((err || !rows.length) && to != 0) {
                cn.release();
                fn(true);
            }
            else {
                // Folder
                if (objType == 1)
                    sql = "UPDATE folders SET parent_id = ? WHERE folder_id = ? AND user_id = ?";
                // Document
                else if (objType == 2)
                    sql = "UPDATE documents SET folder_id = ? WHERE doc_id = ? AND user_id = ?";
                // Contributor Document
                else if (objType == 3)
                    sql = "UPDATE document_contributors SET folder_id = ? WHERE doc_id = ? AND user_id = ?";

                cn.query(sql, [to, id, socket.session.uid], (err, result) => {
                    cn.release();

                    fn(!!err || !result.affectedRows);
                });
            }
        });
    });

};