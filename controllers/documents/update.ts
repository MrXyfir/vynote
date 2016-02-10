import db = require("../../lib/db");

interface IData {
    doc: number, content: string, append?: boolean
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {

    let sql: string = `
        UPDATE document_content SET content = ${data.append ? "CONCAT(content, ?)" : "?"}
        WHERE doc_id IN (
            SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
        )
        OR doc_id IN (
            SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? AND can_write = 1
        )
    `;

    let vars = [
        data.content,
        data.doc, socket.session.uid,
        data.doc, socket.session.uid
    ];

    db(cn => cn.query(sql, vars, (err, result) => {
        cn.release();

        if (err || !result.affectedRows) {
            fn(true);
        }
        else {
            fn(false);
            socket.broadcast.to(''+data.doc).emit("update document", data);
        }
    }));

};