// Action creators
import { changeDocument, selectTab } from "actions/explorer/tabs";
import { loadDocument } from "actions/documents/index";
import {
    initializeRenderObject, navigateToElement
} from "actions/documents/note";

// Modules
import doesMatch from "./does-match";
import buildNote from "lib/note/build";
import getParents from "lib/explorer/scope-parents";
import updateContent from "lib/../../lib/document/update";

export default function (store, socket, check = false) {

    const hash = location.hash.substr(1).split('?')[0];
    
    if (hash.length < 2) return;
    
    let state = store.getState();
    
    // If URL matches state and check == true, return
    if (check && doesMatch(state)) return;
    
    // Get document by id
    // vynote.com/workspace/#docID.doc-name/noteID.note-content
    let id  = hash.split('.')[0];
    let doc = state.explorer.documents[id];
    
    store.dispatch(changeDocument(
        0, id, doc.name, getParents(
            state.explorer.folders, doc.folder_id
        ).map(folder => { return folder.name; }).join("/")
        + "/" + state.explorer.folders[doc.folder_id].name)
    );
    store.dispatch(selectTab(id));
    
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
                if (hash.split('/')[1] !== undefined)
                    element = hash.split('/')[1].split('.')[0];
                
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
                let changes = [];
                res.changes.forEach(change => {
                    changes = changes.concat(JSON.parse(change.change_object).changes);
                });
                
                let data = Object.assign({}, doc, {
                    content: updateContent(res.content, changes),
                    theme: state.user.config.defaultEditorTheme
                });
                
                if (doc.doc_type == 2)
                    data.preview = state.user.config.defaultPageView == "preview";
                
                store.dispatch(loadDocument(data));
            }
        });
    }
    
}