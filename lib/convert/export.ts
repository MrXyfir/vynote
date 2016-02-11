import * as fs from "fs";

import db = require("../db");
import buildNoteObject = require("./note-elements");

function writeToFile(file: string, content: string, fn: Function) {
    fs.writeFile(file, content, (err) => {
        content = null;
        fn(err ? "" : file);
    });
}

function convertNoteDocument(file: string, elements: any[], fn: Function) {
    // Build note from elements
    let note = buildNoteObject(elements);

    // Convert object to text format
    const renderText = (parent: number, level: number): string => {

        let content: string = "";

        // Grab content of all children under parent
        note.ref[parent].forEach(child => {
            for (var i = 0; i < level; i++)
                content += "\t";

            content += "- " + note.notes[child].content + "\r\n";

            // Render text on child
            content += renderText(child, level + 1);
        });

        return content;

    };

    let content: string = renderText(0, 0);
    note = null;

    writeToFile(file, content, fn);
}

export = (doc: number, docType: number, fn: Function) => {

    let sql: string = "";

    if (docType == 1)
        sql = "SELECT note_id, parent_id, content FROM note_elements WHERE doc_id = ?";
    else
        sql = "SELECT content FROM document_content WHERE doc_id = ?";

    db(cn => cn.query(sql, [doc], (err, rows) => {
        cn.release();

        let file: string = doc + "-" + Math.round(Date.now()) + ".txt";

        if (err || !rows.length)
            fn("");
        else if (docType == 1)
            convertNoteDocument(file, rows, (file: string) => fn(file));
        else
            writeToFile(file, rows[0].content, fn);
    }));

};