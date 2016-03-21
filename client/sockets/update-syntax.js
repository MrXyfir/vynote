import { setSyntax } from "../actions/documents/code";

export default function (store, doc, syntax) {
    
    if (store.getState().document.doc_id == doc) {
        store.dispatch(setSyntax(syntax));
    }
    
}