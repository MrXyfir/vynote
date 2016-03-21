import { saveContent } from "../actions/documents/";

export default function (store, data) {
    
    if (store.getState().document.doc_id == data.doc) {
        store.dispatch(saveContent(data.content));
    }
    
}