import db = require("../../lib/db");

interface IData {
    query: {
        name: string, content: string
    },
    docTypes: number[], isRegExp: boolean
}

interface IFound {
    doc_type: number, doc_id: number, folder_id: number, name: string
}

export = (socket: SocketIO.Socket, data: IData, fn: Function) => {

    // Build found[] based on argument variables
    const finish = (firstFound: IFound[], documents: any[], notes: any[]) => {
        let found: IFound[] = [];

        firstFound.forEach(row => {
            // Determine if row.doc_id is in documents or notes
            // Note
            if (row.doc_type == 1) {
                notes.forEach(note => {
                    if (row.doc_id == note.doc_id) found.push(row);
                });
            }
            // Other Document
            else {
                documents.forEach(doc => {
                    if (row.doc_id == doc.doc_id) found.push(row);
                });
            }
        });

        fn(found);
    };

    db(cn => {
        // Grab all of user's documents where type and name match
        let sql: string = `
            SELECT doc_type, doc_id, folder_id, name FROM documents
            WHERE (user_id = ? OR doc_id IN(
                    SELECT doc_id FROM document_contributors WHERE user_id = ?
                )
            )
            AND (doc_type IN (?) AND name ${data.isRegExp ? "REGEXP" : "LIKE"} ?)
        `;
        let vars = [
            socket.session.uid, socket.session.uid,
            data.docTypes, (data.isRegExp ? data.query.name : '%' + data.query.name + '%')
        ];

        cn.query(sql, vars, (err, rows: IFound[]) => {
            // Error or no matches
            if (err || !rows.length) {
                cn.release();
                fn([]);
            }
            // User only wanted to search by name
            else if (data.query.content === "") {
                cn.release();
                fn(rows);
            }
            // Narrow down results further via content match
            else {
                // Grab all non-note document matches
                sql = `
                    SELECT doc_id FROM document_content WHERE doc_id IN (?) 
                    AND content ${data.isRegExp ? "REGEXP" : "LIKE"} ?
                `;
                vars = [
                    rows.map(row => { return row.doc_id; }),
                    (data.isRegExp ? data.query.content : ('%' + data.query.content + '%'))
                ];

                cn.query(sql, vars, (err, documents) => {
                    // Grab all notes where content matches
                    sql = `
                        SELECT doc_id FROM note_elements WHERE doc_id IN (?) 
                        AND content ${data.isRegExp ? "REGEXP" : "LIKE"} ?
                    `;
                    cn.query(sql, vars, (err, notes) => {
                        cn.release();

                        finish(rows, documents, notes);
                    });
                });
            }
        });
    });

};