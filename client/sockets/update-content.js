// Action creators
import { saveContent, toggleMarkForReload } from "actions/documents/index";
import { markForReload } from "actions/explorer/tabs";

// Modules
import updateContent from "lib/../../lib/document/update";

export default function (store, data) {
    
    let state = store.getState();
    
    if (state.document.doc_id == data.doc) {
        if (data.action === "RELOAD")
            location.reload();
        
        store.dispatch(saveContent(
            updateContent(state.document.content, data.changes)
        ));
        store.dispatch(toggleMarkForReload());
    }
    else if (data.doc in state.explorer.tabs.list) {
        store.dispatch(markForReload(data.doc));
    }
    
}