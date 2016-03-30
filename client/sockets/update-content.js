import { saveContent, toggleMarkForReload } from "../actions/documents/";
import { markForReload } from "../actions/explorer/tabs";

export default function (store, data) {
    
    let state = store.getState();
    
    if (state.document.doc_id == data.doc) {
        store.dispatch(saveContent(data.content));
        store.dispatch(toggleMarkForReload());
    }
    else if (data.doc in state.explorer.tabs.list) {
        store.dispatch(markForReload(data.doc));
    }
    
}