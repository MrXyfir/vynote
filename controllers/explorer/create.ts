import db = require("../../lib/db");

interface IData {
    objType: number, folder: number, name: string,
    docType?: number, color?: number, encrypt?: string
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {

    let sql: string = "SELECT folder_id FROM folders WHERE folder_id = ? AND user_id = ?";

    // Ensure that user owns folder they want to create object in
    db(cn => cn.query(sql, [data.folder, socket.session.uid], (err, rows) => {
        if ((err || !rows.length) && data.folder != 0) {
            cn.release();
            fn(true, "Folder does not exist");
        }
        else {
            let insert = {};

            // Create a new folder
            if (data.objType == 1) {
                data.color = (data.color < 0 || data.color > 255) ? 0 : data.color;
                data.name = !data.name.match(/^[\w\d-.,#$%&()]{1,100}$/) ? "New Folder" : data.name;

                sql = "INSERT INTO folders SET ?";
                insert = {
                    user_id: socket.session.uid, parent_id: data.folder,
                    name: data.name, color: data.color
                };
            }
            // Document
            else {
                data.name = !data.name.match(/^[\w\d-.,#$%&()]{1,100}$/) ? "New File" : data.name;

                // data.encrypt is encrypt("KEY", userEncKey), used to verify encryption keys
                let encrypt: string = (data.encrypt.length > 0 && socket.session.subscription > Date.now() / 1000)
                    ? data.encrypt : "";

                sql = "INSERT INTO documents SET ?";
                insert = {
                    user_id: socket.session.uid, doc_type: data.docType,
                    created: Math.round(new Date().getTime() / 1000),
                    folder_id: data.folder, name: data.name,
                    encrypt: encrypt
                };
            }

            cn.query(sql, insert, (err, result) => {
                cn.release();

                if (err || !result.affectedRows)
                    fn(true, "An unknown error occured");
                else
                    fn(false, result.insertId);
            });
        }
    }));

};