import db = require("../../lib/db");

interface IData {
    doc: number, email: string,
    permissions: {
        write: boolean, update: boolean, delete: boolean
    }
};

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {

    let sql: string = `
        UPDATE document_contributors SET can_write = ?, can_delete = ?, can_update = ? 
        WHERE doc_id IN (
            SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
        )
        AND user_id IN (
            SELECT user_id FROM users WHERE email = ?
        )
    `;
    let vars = [
        +data.permissions.write, +data.permissions.delete, +data.permissions.update,
        data.doc, socket.session.uid,
        data.email
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();

        fn(!!err || !result.affectedRows);
    }));

};