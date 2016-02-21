import db = require("../../lib/db");

interface IData {
    objType: number, id: number, name: string
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {

    // Validate name
    if (!data.name.match(/^[\w\d-.,#$%&()]{1,50}$/)) {
        fn(true, "Invalid name characters or length");
    }
    // Contributor document
    else if (data.objType == 3) {
        fn(true, "Only the file creator can rename this file");
    }
    // Document or folder
    else {
        // Update folders|documents where folder_id|doc_id
        let sql: string = `
            UPDATE ${data.objType == 1 ? "folders" : "documents"} 
            SET name = ? WHERE ${data.objType == 1 ? "folder_id" : "doc_id"} = ? AND user_id = ?
        `;

        db(cn => cn.query(sql, [data.name, data.id, socket.session.uid], (err, result) => {
            cn.release();

            fn(!!err || !result.affectedRows);
        }));
    }

};