import db = require("../../lib/db");

interface IData {
    note: number, parent: number, content: string
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {
    
    if (Object.keys(socket.rooms).indexOf(''+data.note) == -1) {
        fn(true);
        return;
    }
    
    if (data.content.toString().length > 500) {
        fn(false);
        return;
    };

    // Get the highest note_id value for doc_id
    let sql: string = "SELECT IFNULL(MAX(note_id), 0) as id FROM note_elements WHERE doc_id = ?";
    
    db(cn => cn.query(sql, [data.note], (err, rows) => {
        if (err) {
            cn.release();
            fn(true);
        }
        else {
            let id: number = rows[0].id, vars: any[] = [];

            // Insert into note_elements if user owns document
            // or is a contributor with write access
            sql = `
                INSERT INTO note_elements (doc_id, parent_id, note_id, content)
                SELECT doc_id, ?, ?, ? FROM documents
                WHERE (doc_id = ? AND user_id = ?) OR (doc_id IN (
                    SELECT doc_id FROM document_contributors 
                    WHERE doc_id = ? AND user_id = ? AND can_write = 1
                ))
            `;

            // Attempts to insert up to 3 times in case of conflicting
            // doc_id-note_id index
            const insert = () => {
                vars = [
                    data.parent, ++id, data.content,
                    data.note, socket.session.uid,
                    data.note, socket.session.uid
                ];

                cn.query(sql, vars, (err, result) => {
                    if (err || !result.affectedRows) {
                        if (id >= rows[0].id + 3) {
                            cn.release();
                            fn(true);
                        }
                        else {
                            insert();
                        }
                    }
                    else {
                        cn.release();
                        fn(false, id);
                        socket.broadcast.to(''+data.note).emit("create element", data);
                    }
                });
            };

            insert();
        }
    }));

};