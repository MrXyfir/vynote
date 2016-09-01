const db = require("lib/db");

/* interface IData {
    objType: number, id: number, to: number
} */

module.exports = function(socket, data, fn) {

    if (data.objType != 1 && data.to == 0) {
        fn(true, "Cannot move document to root folder");
        return;
    }

    db(cn => {
        let sql = "";

        // Ensure that user owns folder they want to move object to
        sql = "SELECT * FROM folders WHERE user_id = ? AND folder_id = ?";
        cn.query(sql, [socket.session.uid, data.to], (err, rows) => {
            if ((err || !rows.length) && data.to != 0) {
                cn.release();
                fn(true, "Folder does not exist in your account");
            }
            else {
                // Folder
                if (data.objType == 1)
                    sql = "UPDATE folders SET parent_id = ? WHERE folder_id = ? AND user_id = ?";
                // Document
                else if (data.objType == 2)
                    sql = "UPDATE documents SET folder_id = ? WHERE doc_id = ? AND user_id = ?";
                // Contributor Document
                else if (data.objType == 3)
                    sql = "UPDATE document_contributors SET folder_id = ? WHERE doc_id = ? AND user_id = ?";

                cn.query(sql, [data.to, data.id, socket.session.uid], (err, result) => {
                    cn.release();

                    fn(!!err || !result.affectedRows);
                });
            }
        });
    });

}