const db = require("lib/db");

module.exports = function(notes) {
    
    // Convert object to text format
    const renderText = (parent, level) => {
        
        // Parent has no children
        if (notes[parent].children.length == 0)
            return "";

        let content = "";

        // Grab content of all children under parent
        notes[parent].children.forEach(child => {
            for (let i = 0; i < level; i++)
                content += "\t";

            content += "- " + notes[child].content + "\r\n";

            // Render text on child
            content += renderText(child, level + 1);
        });

        return content;

    };

    let content = renderText("home", 0);
    notes = null;

    return content;

}