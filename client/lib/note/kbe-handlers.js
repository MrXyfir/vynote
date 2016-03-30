// Action creators
import {
    moveElement, navigateToElement, toggleShowChildren, deleteElement,
    addElement, editElement, elementCreated
} from "../../actions/documents/note";
import { error } from "../../actions/notification";

// Modules
import { encrypt } from "../crypto";
import generateID from "./generate-id";

// Move element being edited into older sibling's children
export function tab(props) {
    let parent = props.data.content[props.id].parent;
    let index  = props.data.content[parent].children.indexOf(props.id);
    
    if (index > 0) {
        let sibling = props.data.content[parent].children[index - 1];
        
        let data = {
            doc: props.data.doc_id, action: "MOVE", id: props.id,
            index: -1, parent: sibling
        };
        
        if (props.data.content[props.id].create) {
            data.content = (
                props.data.encrypted
                ? encrypt(
                    document.querySelector(".editing").value, props.data.encrypt
                )
                : document.querySelector(".editing").value
            );
            data.action = "CREATE";
        }
        
        props.socket.emit("change note element", data, (err, res) => {
            if (err) {
                props.dispatch(error(res));
            }
            else {
                if (props.data.content[props.id].create)
                    props.dispatch(elementCreated(props.id));
                
                props.dispatch(moveElement(
                    props.id, sibling
                ));
                
                // Show sibling's children if needed
                if (props.data.render.showChildren.indexOf(sibling) == -1)
                    props.dispatch(toggleShowChildren(sibling));
            }
        });
    }
}

// Move element being edited into grandparent's children
export function shiftTab(props) {
    let parent = props.data.content[props.id].parent;
    let gparent = props.data.content[parent].parent;

    if (gparent) {
        let index = props.data.content[gparent].children.indexOf(parent) + 1;

        let data = {
            doc: props.data.doc_id, action: "MOVE", id: props.id,
            parent: gparent, index
        };
        
        if (props.data.content[props.id].create) {
            data.content = (
                props.data.encrypted
                ? encrypt(
                    document.querySelector(".editing").value, props.data.encrypt
                )
                : document.querySelector(".editing").value
            );
            data.action = "CREATE";
        }

        props.socket.emit("change note element", data, (err, res) => {
            if (err) {
                props.dispatch(error(res));
            }
            else {
                if (props.data.content[props.id].create)
                    props.dispatch(elementCreated(props.id));
                
                props.dispatch(moveElement(props.id, gparent, index));
            }
        });
    }
}

// Change scope to scope's parent
export function altLeft(props) {
    let parent = props.data.content[props.data.render.scope].parent;

    if (parent) props.dispatch(navigateToElement(parent));
}

// Change scope to element being edited
export function altRight(props) {
    props.dispatch(navigateToElement(props.id));
}

// Hide editing element's children
export function altUp(props) {
    if (props.data.render.showChildren.indexOf(props.id) > -1)
        props.dispatch(toggleShowChildren(props.id));
}

// Show editing element's children
export function altDown(props) {
    if (props.data.render.showChildren.indexOf(props.id) == -1)
        props.dispatch(toggleShowChildren(props.id));
}

// Delete element and its children
export function altDel(props) {
    if (props.data.content[props.id].create) {
        props.dispatch(deleteElement(props.id));
    }
    else {
        let data = {
            doc: props.data.doc_id, action: "DELETE", id: props.id
        };
        
        props.socket.emit("change note element", data, (err, res) => {
            if (err)
                props.dispatch(error(res));
            else
                props.dispatch(deleteElement(props.id));
        });
    }
}

// Create child element
export function altEnter(props) {
    let id = generateID(props.data.content);

    props.dispatch(addElement(props.id, id));
    
    if (props.data.render.showChildren.indexOf(props.id) == -1)
        props.dispatch(toggleShowChildren(props.id));
    
    props.dispatch(editElement(id));
}

// Focus on search box
export function ctrlF(props, e) {
    e.preventDefault();
    document.querySelector(".note-filter-controls > input").focus();
}

// Move up in elements
export function up(props) {
    let parent = props.data.content[props.id].parent;
    let index  = props.data.content[parent].children.indexOf(props.id);
    
    // Switch to older sibling element
    if (index > 0) {
        props.dispatch(editElement(
            props.data.content[parent].children[index - 1]
        ));
    }
    // Switch to parent element
    else if (parent != props.data.render.scope) {
        props.dispatch(editElement(parent));
    }
}

// Move down in elements
export function down(props) {
    if ( // Switch to first child element
        props.data.content[props.id].children.length
        &&
        props.data.render.showChildren.indexOf(props.id) > -1
    ) {
        props.dispatch(editElement(
            props.data.content[props.id].children[0]
        ));
    }
    else {
        let parent = props.data.content[props.id].parent;
        let index  = props.data.content[parent].children.indexOf(props.id);
        
        // Switch to younger sibling
        if (index != props.data.content[parent].children.length - 1) {
            props.dispatch(editElement(
                props.data.content[parent].children[index + 1]
            ));
        } 
        else {
            let gparent = props.data.content[parent].parent;
            index = props.data.content[gparent].children.indexOf(parent);
            
            // Switch to parent's younger sibling
            if (index != props.data.content[gparent].children.length - 1) {
                props.dispatch(editElement(
                    props.data.content[gparent].children[index + 1]
                ));
            }
        }
    }
}

// Shortcut
export function cbracket(props, e) {
    if (props.user.subscription > Date.now() && Object.keys(props.user.shortcuts).length) {
        let content = document.querySelector(".editing").value;
        
        // Replace shortcuts in content
        Object.keys(props.user.shortcuts).forEach(sc => {
            content = content.replace("${" + sc, props.user.shortcuts[sc]);
        });
        
        // If a shortcut was inserted, prevent '}' from being inserted
        if (content != document.querySelector(".editing").value)
            e.preventDefault();
        
        document.querySelector(".editing").value = content;
    }
}

// User reference
export function at(props) {
    
}

// Tag
export function hash(props) {
    
}