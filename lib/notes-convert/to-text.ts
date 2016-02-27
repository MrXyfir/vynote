import db = require("../db");

export = (note: any): string => {
        
    // Convert object to text format
    const renderText = (parent: number, level: number): string => {

        // Undefined if element (parent) has no children
        if (note.ref[parent] === undefined)
            return "";

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

    return content;

};