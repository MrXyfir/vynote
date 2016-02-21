import db = require("../../lib/db");

interface IData {
    objType: number, folder: number, name: string,
    docType?: number, color?: number, encrypt?: string
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {

    let sql: string = `
        SELECT (
            SELECT COUNT(folder_id) FROM folders WHERE user_id = ?
        ) as folder_count, (
            SELECT folder_id FROM folders WHERE folder_id = ? AND user_id = ?
        ) as folder_exists, (
            SELECT COUNT(doc_id) FROM documents WHERE user_id = ?
        ) as doc_count
    `;
    let vars = [
        socket.session.uid,
        data.folder, socket.session.uid,
        socket.session.uid
    ];

    // Ensure that user owns folder they want to create object in
    db(cn => cn.query(sql, vars, (err, rows) => {
        if (err || (rows[0].folder_exists == null && data.folder != 0)) {
            cn.release();
            fn(true, "Folder does not exist");
        }
        else {
            let insert = {};

            // Create a new folder
            if (data.objType == 1) {
                // Free members are limited to 15 folders
                if (rows[0].folder_count >= 15 && Date.now() > socket.session.subscription) {
                    cn.release();
                    fn(true, "Free users are limited to 15 folders");
                    return;
                }

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
                // Documents cannot live in root
                if (data.folder == 0) {
                    cn.release();
                    fn(true, "You cannot create documents in the root folder");
                    return;
                }

                // Free members are limited to 100 documents
                if (rows[0].doc_count >= 100 && Date.now() > socket.session.subscription) {
                    cn.release();
                    fn(true, "Free users are limited to 100 documents");
                    return;
                }

                data.name = !data.name.match(/^[\w\d-.,#$%&()]{1,100}$/) ? "New File" : data.name;

                // data.encrypt is encrypt("KEY", userEncKey), used to verify encryption keys
                let encrypt: string = (data.encrypt.length > 0 && Date.now() > socket.session.subscription)
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
                if (err || !result.affectedRows) {
                    cn.release();
                    fn(true, "An unknown error occured");
                }
                else {
                    let id: number = result.insertId;

                    // Create row in document_content for non-note document
                    if (data.objType == 2 && data.docType != 1) {
                        sql = "INSERT INTO document_content SET ?";
                        cn.query(sql, { doc_id: id }, (err, result) => {
                            cn.release();

                            fn(false, id);
                        });
                    }
                    else {
                        fn(false, id);
                    }
                }
            });
        }
    }));

};