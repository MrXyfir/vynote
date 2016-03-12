import createElement = require("./create-element");
import deleteElement = require("./delete-element");
import updateContent = require("./update-content");
import setFlags = require("./set-flags");

export = (doc: number, cn: any) => {

    let sql: string = `
        SELECT * FROM document_changes WHERE doc_id = ?
    `;
    cn.query(sql, [doc], (err, changes) => {
        if (err || !changes.length) {
            cn.release();
            return;
        }

        // Grab and parse note object from document_content
        sql = `
            SELECT content FROM document_content WHERE doc_id = ?
        `;
        cn.query(sql, [doc], (err, rows) => {
            // Build note object
            let note = JSON.parse(rows[0].content);
            rows = null;

            // Loop through rows calling appropriate function based on action
            changes.forEach(change => {
                let co = JSON.parse(change.change_object);

                switch (co.action) {
                    case "CREATE":
                        createElement(note, co); break;
                    case "DELETE":
                        deleteElement(note, co); break;
                    case "UPDATE":
                        updateContent(note, co); break;
                    case "SET_FLAGS":
                        setFlags(note, co); break;
                }
            });

            // Write note object to document_content
            sql = "UPDATE document_content SET content = ? WHERE doc_id = ?";
            cn.query(sql, [JSON.stringify(note), doc], (err, result) => {
                if (err || !result.affectedRows) {
                    cn.release();
                }
                else {
                    sql = "DELETE FROM document_changes WHERE doc_id = ?";
                    cn.query(sql, [doc], (err, result) => cn.release());
                }
            });
        });
    });

};