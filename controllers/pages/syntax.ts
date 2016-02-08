import db = require("../../lib/db");

export = (socket: SocketIO.Socket, doc: number, syntax: number, fn: Function) => {

    // User must be in document's room
    if (Object.keys(socket.rooms).indexOf(''+doc) == -1) {
        fn(true);
        return;
    }

    // Check validity of syntax
    if (typeof syntax != "number" || syntax > 255) {
        fn(true);
        return;
    }

    // Only document creator can update syntax and doc_type must be code
    let sql: string = `
        UPDATE documents SET syntax = ? WHERE doc_id = ? AND doc_type = 3 AND user_id = ?
    `;

    db(cn => cn.query(sql, [syntax, doc, socket.session.uid], (err, result) => {
        cn.release();

        if (err || !result.affectedRows) {
            fn(true);
        }
        else {
            fn(false);
            socket.broadcast.to(''+doc).emit("update syntax", doc, syntax);
        }
    }));
};