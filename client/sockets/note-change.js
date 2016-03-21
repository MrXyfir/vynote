import {
    addElement, deleteElement, moveElement, updateElementContent, setElementFlags
} from "../actions/documents/note";

export default function (store, data) {
    
    if (store.getState().document.doc_id == data.doc) {
        switch (data.action) {
            case "CREATE":
                return store.dispatch(addElement(data.parent, data.id, data.index));
                
            case "DELETE":
                return store.dispatch(deleteElement(data.id));
                
            case "UPDATE":
                return store.dispatch(updateElementContent(data.id, data.content));
                
            case "SET_FLAGS":
                return store.dispatch(setElementFlags(data.id, data.content));
                
            case "MOVE":
                return store.dispatch(moveElement(data.id, data.parent, data.index));
        }
    }
    
}