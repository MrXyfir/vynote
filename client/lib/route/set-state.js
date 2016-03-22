// Action creators
import { loadDocument } from "../../actions/documents/";
import {
initializeRenderObject, navigateToElement
    
} from "../../actions/documents/note";

// Modules
import buildNote from "../../lib/note/build";

export default function (store, socket) {
    
    // Parse URL
    let a = document.createElement('a');
    a.href = location.href;
    let paths = a.pathname.split('/').slice(2);
    
    if (paths[0] === undefined) return;
    
    let state = store.getState();
    
    // Document does not exist
    if (state.explorer.documents[paths[0]] === undefined) return;
    
    let doc = state.explorer.documents[paths[0]];
    
    // Let Document container handle loading encrypted document
    if (doc.encrypted) {
        let data = Object.assign({}, doc, {
            encrypt: "", theme: state.user.config.defaultEditorTheme
        });
        
        if (doc.doc_type == 2)
            data.preview = state.user.config.defaultPageView == "preview";
        
        this.props.dispatch(loadDocument(data));
    }
    // Note document
    else if (doc.doc_type == 1) {
        socket.emit("get note object", paths[0], "", (err, res) => {
            if (!err) {
                store.dispatch(loadDocument(
                    Object.assign({}, this.props.data, {
                        content: buildNote(res.content, res.changes)
                    })
                ));
                store.dispatch(initializeRenderObject());
                
                if (paths[3] !== undefined) {
                    store.dispatch(navigateToElement(paths[3]));
                }
            }
        });
    }
    // Other document
    else {
        socket.emit("get document content", paths[0], "", (err, res) => {
            if (!err) {
                let data = Object.assign({}, doc, {
                    content: res, theme: this.props.user.config.defaultEditorTheme
                });
                
                if (doc.doc_type == 2)
                    data.preview = this.props.user.config.defaultPageView == "preview";
                
                this.props.dispatch(loadDocument(data));
            }
        });
    }
    
}