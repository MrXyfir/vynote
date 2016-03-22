// Action creators
import { loadDocument } from "../../actions/documents/";
import {
    initializeRenderObject, navigateToElement
} from "../../actions/documents/note";

// Modules
import doesMatch from "./does-match";
import buildNote from "../../lib/note/build";

export default function (store, socket, check = false) {
    
    if (location.hash.length < 2) return;
    
    let state = store.getState();
    
    // If URL matches state and check == true, return
    if (check && doesMatch(state)) return;
    
    // Get document by id
    // vynote.com/workspace/#docID.doc-name/noteID.note-content
    let id  = location.hash.substr(1).split('.')[0];
    let doc = state.explorer.documents[id];
    
    // Document does not exist
    if (doc === undefined) {
        return;
    }
    // Encrypted document
    else if (doc.encrypted) {
        let data = Object.assign({}, doc, {
            encrypt: "", theme: state.user.config.defaultEditorTheme
        });
        
        if (doc.doc_type == 2)
            data.preview = state.user.config.defaultPageView == "preview";
        
        store.dispatch(loadDocument(data));
    }
    // Note document
    else if (doc.doc_type == 1) {
        socket.emit("get note object", id, "", (err, res) => {
            if (!err) {
                let element = "";
                
                // Grab note element (if available) before we load document
                if (location.hash.split('/')[1] !== undefined)
                    element = location.hash.split('/')[1].split('.')[0];
                
                let content = buildNote(res.content, res.changes);
                
                // Load document and initialize render
                store.dispatch(loadDocument(
                    Object.assign({}, doc, { content })
                ));
                store.dispatch(initializeRenderObject());
                
                // Navigate to element present in previous url
                if (content[element] !== undefined)
                    store.dispatch(navigateToElement(element));
            }
        });
    }
    // Other document
    else {
        socket.emit("get document content", id, "", (err, res) => {
            if (!err) {
                let data = Object.assign({}, doc, {
                    content: res, theme: state.user.config.defaultEditorTheme
                });
                
                if (doc.doc_type == 2)
                    data.preview = state.user.config.defaultPageView == "preview";
                
                store.dispatch(loadDocument(data));
            }
        });
    }
    
}