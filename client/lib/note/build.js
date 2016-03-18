let createElement = require("../../../lib/note/create-element");
let deleteElement = require("../../../lib/note/delete-element");
let updateContent = require("../../../lib/note/update-content");
let moveElement = require("../../../lib/note/move-element");
let setFlags = require("../../../lib/note/set-flags");

import { decrypt } from "../crypto";

export default function (notes, changes, key = "") {
    
    let encrypted = (key.length > 0);
    
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
            case "MOVE":
                return moveElement(notes, co);
        }
    });
    
    if (encrypted) {
        Object.keys(notes).forEach(key => {
            notes[key].content = decrypt(notes[key].content, key);
        });
    }
    
    return notes;
    
}