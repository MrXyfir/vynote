const update = require("./update");

module.exports = function(doc, cn, fn) {

    const finish = (err) => {
        if (fn === undefined)
            cn.release();
        else
            fn(err);
    };

    let sql = `
        SELECT * FROM document_changes WHERE doc_id = ? ORDER BY version ASC
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
            changes.forEach(change => {
                rows[0].content = update(rows[0].content, JSON.parse(change.change_object).changes);
            });

            // Write notes object to document_content
            sql = "UPDATE document_content SET content = ? WHERE doc_id = ?";
            cn.query(sql, [rows[0].content, doc], (err, result) => {
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