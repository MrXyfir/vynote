let createElement = require("./create-element");
let deleteElement = require("./delete-element");
let updateContent = require("./update-content");
let setFlags = require("./set-flags");

export default function (notes, changes) {
    
    notes = JSON.parse(notes);
    
    changes.forEach(change => {
        let co = JSON.parse(change.change_object);
        
        switch (co.action) {
            case "CREATE":
                return createElement(notes, co);
            case "DELETE":
                return deleteElement(notes, co);
            case "UPDATE":
                return updateContent(notes, co);
            case "SET_FLAGS":
                return setFlags(notes, co);
        }
    });
    
    return notes;
    
}