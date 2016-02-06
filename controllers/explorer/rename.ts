import db = require("../../lib/db");

export = (socket: SocketIO.Socket, objType: number, id: number, name: string, fn: Function) => {

    // Validate name
    if (!name.match(/^[\w\d-.,#$%&()]{1,100}$/)) {
        fn(true, "Invalid name characters or length");
    }
    // Contributor document
    else if (objType == 3) {
        fn(true, "Only the file creator can rename this file");
    }
    // Document or folder
    else {
        // Update folders|documents where folder_id|doc_id
        let sql: string = "UPDATE " + (objType == 1 ? "folders" : "documents") +
            " SET name = ? WHERE " + (objType == 1 ? "folder_id" : "doc_id") + " = ? AND user_id = ?";

        db(cn => cn.query(sql, [name, id, socket.session.uid], (err, result) => {
            cn.release();

            fn(!!err || !result.affectedRows);
        }));
    }

};