import db = require("../db");

export = (notes: any): string => {
        
    // Convert object to text format
    const renderText = (parent: string, level: number): string => {

        // Undefined if element (parent) has no children
        if (notes[parent].children.length == 0)
            return "";

        let content: string = "";

        // Grab content of all children under parent
        notes[parent].children.forEach(child => {
            for (var i = 0; i < level; i++)
                content += "\t";

            content += "- " + notes[child].content + "\r\n";

            // Render text on child
            content += renderText(child, level + 1);
        });

        return content;

    };

    let content: string = renderText("home", 0);
    notes = null;

    return content;

};