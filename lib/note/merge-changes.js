const createElement = require("./create-element");
const deleteElement = require("./delete-element");
const updateContent = require("./update-content");
const moveElement = require("./move-element");
const setFlags = require("./set-flags");

module.exports = function(doc, cn, fn) {

    const finish = (err) => {
        if (fn === undefined)
            cn.release();
        else
            fn(err);
    };

    let sql = `
        SELECT * FROM document_changes WHERE doc_id = ?
    `;
    cn.query(sql, [doc], (err, changes) => {
        if (err || !changes.length) {
            finish(true);
            return;
        }

        // Grab and parse notes object from document_content
        sql = `
            SELECT content FROM document_content WHERE doc_id = ?
        `;
        cn.query(sql, [doc], (err, rows) => {
            // Build notes object
            let notes = JSON.parse(rows[0].content);
            rows = null;

            // Loop through rows calling appropriate function based on action
            changes.forEach(change => {
                let co = JSON.parse(change.change_object);

                switch (co.action) {
                    case "CREATE":
                        createElement(notes, co); break;
                    case "DELETE":
                        deleteElement(notes, co); break;
                    case "UPDATE":
                        updateContent(notes, co); break;
                    case "SET_FLAGS":
                        setFlags(notes, co); break;
                    case "MOVE":
                        moveElement(notes, co); break;
                }
            });

            // Write notes object to document_content
            sql = "UPDATE document_content SET content = ? WHERE doc_id = ?";
            cn.query(sql, [JSON.stringify(notes), doc], (err, result) => {
                if (err || !result.affectedRows) {
                    finish(true);
                }
                else {
                    sql = "DELETE FROM document_changes WHERE doc_id = ?";
                    cn.query(sql, [doc], (err, result) => finish(false));
                }
            });
        });
    });

}