import db = require("../../lib/db");

interface IData {
    doc: number, content: any, action: string
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {

    if (Object.keys(socket.rooms).indexOf(''+data.doc) == -1) {
        fn(true);
        return;
    }

    let value: string = "";

    // Determine what to place after 'SET content = '
    switch (data.action) {
        case "OVERWRITE":
            value = "?"; break;
        case "APPEND":
            value = "CONCAT(content, ?)"; break;
        case "REMOVE":
            value = "SUBSTR(content, 1, CHAR_LENGTH(content) - ?)"; break;
        case "INSERT":
            value = "INSERT(content, ?, CHAR_LENGTH(?), ?)"; break;
        case "REPLACE":
            value = "REPLACE(content, ?, ?)";
    }

    let vars = [];

    // Determine vars based on action
    switch (data.action) {
        case "INSERT":
            // +2 because JS strings start at 0 and INSERT() includes the starting point
            vars = [ data.content.at + 2, data.content.length, data.content.string ];
            break;
        case "REPLACE":
            vars = [ data.content.find, data.content.replace ];
            break;
        default:
            vars = [ data.content ];
    }

    // Add variables that are always present
    vars = vars.concat([
        data.doc, socket.session.uid,
        data.doc, socket.session.uid
    ]);

    let sql: string = `
        UPDATE document_content SET content = ${value} 
        WHERE doc_id IN (
            SELECT doc_id FROM documents WHERE doc_id = ? AND user_id = ?
        )
        OR doc_id IN (
            SELECT doc_id FROM document_contributors WHERE doc_id = ? AND user_id = ? AND can_write = 1
        )
    `;

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