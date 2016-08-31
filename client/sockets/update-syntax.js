import { setSyntax } from "actions/documents/code";
import { markForReload } from "actions/explorer/tabs";

export default function (store, doc, syntax) {
    
    let state = store.getState();
    
    if (state.document.doc_id == doc) {
        store.dispatch(setSyntax(syntax));
    }
    else if (doc in state.explorer.tabs.list) {
        store.dispatch(markForReload(doc));
    }
    
}